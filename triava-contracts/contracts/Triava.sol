pragma solidity ^0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Triava is Ownable {
    using SafeMath for uint256;
    using ECDSA for bytes32;

    /*** EVENTS ***/

    event CreatorStaking(address indexed creator, uint256 stakingAmount);
    event ValidatorStaking(address indexed validator, uint256 stakingAmount);
    event NewQuestion(address indexed creator, bytes32 questionHash);
    event LogCreatorSlashing(address indexed creator, uint256 slashingAmount);
    event QuestionValidated(
        address indexed validator,
        bytes32 questionHash,
        bool isApproved
    );

    /*** DATA TYPES ***/

    struct Option {
        string text;
        bool isCorrect;
    }

    struct Question {
        bool isUsed;
        bytes32[] optionHashes;
        address creator;
        string text;
        bytes32[] options;
        address[] validators;
        address[] rejectors;
        bool isRewarded;
    }

    struct Quiz {
        bytes32[] questionHashes;
        bytes32[] correctOptionHashes;
        uint256 startTime;
        uint256 endTime;
        uint256 entryFee;
    }

    /*** STORAGE ***/

    /// @dev quiz to winner user addresses
    mapping(uint256 => address[]) winners;

    /// @dev quiz to user address to registration status
    mapping(uint256 => mapping(address => bool)) contestants;

    /// @dev quiz to user address to submission status
    mapping(uint256 => mapping(address => bool)) submissions;

    /// @dev quiz to user address to responses
    mapping(uint256 => mapping(address => bytes32[])) contestantAnswers;

    /// @dev quiz to user address to true counts
    mapping(uint256 => mapping(address => uint256)) trueAnswerCounts;

    /// @dev quiz to user address array
    mapping(uint256 => address[]) quizParticipants;

    /// @dev minimum creator staking amount
    uint256 public minCreatorStaking = 10**17;

    /// @dev minimum validator staking amount
    uint256 public minValidatorStaking = 10**17;

    /// @dev Addres of Triava Manager Account
    address public triavaManager;

    /// @dev Stakings for question creators
    mapping(address => uint256) public creatorStakings;

    /// @dev Stakings for question validators
    mapping(address => uint256) public validatorStakings;

    /// @dev QuestionHashes to questions
    mapping(bytes32 => Question) public questions;

    /// @dev OptionHashes to options
    mapping(bytes32 => Option) public options;

    /// @dev Amount of creator slashings
    /// @dev CreatorAddress -> Amount
    mapping(address => uint256) public creatorSlashings;

    /// @dev Amount of creator slashings
    /// @dev CreatorAddress -> Amount
    mapping(address => uint256) public validatorSlashings;

    /// @dev QuizIds to quiz
    mapping(uint256 => Quiz) public quizzes;

    /// @dev creator Rate for contest
    uint256 public creatorRate = 5;

    /// @dev Validator Rate for contest
    uint256 public validatorRate = 5;

    /// @dev Minimum vote Required to submit
    uint256 public minimumVoteRequired = 3;

    /*** MODIFIERS ***/
    modifier onlyTriavaManager() {
        require(
            msg.sender == triavaManager,
            "Only Triava Manager can execute this transaction"
        );
        _;
    }

    modifier onlyCreator() {
        require(
            creatorStakings[msg.sender] >= minCreatorStaking,
            "Only staked creators can execute this transaction"
        );
        _;
    }

    modifier onlyValidator() {
        require(
            validatorStakings[msg.sender] >= minValidatorStaking,
            "Only staked validators can execute this transaction"
        );
        _;
    }

    /*** FUNCTIONS ***/

    function creatorStake() public payable {
        require(
            msg.value >= minCreatorStaking,
            "Can not stake less than minimum amount"
        );
        creatorStakings[msg.sender] = creatorStakings[msg.sender].add(
            msg.value
        );
        emit CreatorStaking(msg.sender, msg.value);
    }

    function validatorStake() public payable {
        require(
            msg.value >= minValidatorStaking,
            "Can not stake less than minimum amount"
        );
        validatorStakings[msg.sender] = validatorStakings[msg.sender].add(
            msg.value
        );
        emit ValidatorStaking(msg.sender, msg.value);
    }

    function createQuestion(bytes32 questionHash,bytes32[] memory _optionHashes) external onlyCreator {
        Question memory question;
        question.creator = msg.sender;
        question.optionHashes = _optionHashes;
        questions[questionHash] = question;
    }

    function validateQuestion(bytes32 questionHash, bool isApproved)
        external
        onlyValidator
    {
        bool notValidatedEarlier = true;
        uint256 totalVoteUsed = questions[questionHash].validators.length +
            questions[questionHash].rejectors.length;
        require(
            totalVoteUsed < minimumVoteRequired,
            "The question has already enough notes"
        );

        for (
            uint256 i = 0;
            i < questions[questionHash].validators.length;
            i++
        ) {
            if (msg.sender == questions[questionHash].validators[i])
                notValidatedEarlier = false;
        }
        require(notValidatedEarlier, "Can not validate same question again");
        require(
            questions[questionHash].creator != msg.sender,
            "You can not validate your own question"
        );
        if (isApproved) questions[questionHash].validators.push(msg.sender);
        else questions[questionHash].rejectors.push(msg.sender);

        emit QuestionValidated(msg.sender, questionHash, isApproved);
    }

    function createQuiz(
        uint256 quizId,
        bytes32[] memory _questionHashes,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _entryFee
    ) public onlyTriavaManager {
        Quiz memory quiz;
        quiz.questionHashes = _questionHashes;
        quiz.startTime = _startTime;
        quiz.endTime = _endTime;
        quiz.entryFee = _entryFee;
        for (uint256 i = 0; i < _questionHashes.length; i++) {
            require(
                questions[_questionHashes[i]].isUsed == false,
                "This question is already used"
            );
            questions[_questionHashes[i]].isUsed = true;
        }
        quizzes[quizId] = quiz;
    }

    function joinQuiz(uint256 quizId) external payable {
        require(
            msg.value >= quizzes[quizId].entryFee,
            "Can not join without paying entryFee"
        );
        require(
            contestants[quizId][msg.sender] != true,
            "You can join only once"
        );
        contestants[quizId][msg.sender] = true;
        quizParticipants[quizId].push(msg.sender);
    }

    function submitQuiz(uint256 quizId, bytes32[] memory _optionHashes)
        external
    {
        require(contestants[quizId][msg.sender], "Only joined user can submit");
        require(
            quizzes[quizId].endTime < block.timestamp,
            "Can not submit after the submission period is over"
        );
        require(
            submissions[quizId][msg.sender] != true,
            "You can only submit once for the quiz"
        );
        submissions[quizId][msg.sender] = true;
        contestantAnswers[quizId][msg.sender] = _optionHashes;
    }

    function finalizeQuiz(uint256 quizId, bytes32[] memory _correctOptionHashes)
        external
        onlyTriavaManager
    {
        uint256 maxCorrectAnswerCount = 0;
        quizzes[quizId].correctOptionHashes = _correctOptionHashes;
        for (uint256 i = 0; i < quizParticipants[quizId].length; i++) {
            address currParticipant = quizParticipants[quizId][i];
            trueAnswerCounts[quizId][currParticipant] = 0; // setting true count to zero
            for (
                uint256 order = 0;
                order < _correctOptionHashes.length;
                order++
            ) {
                if (
                    contestantAnswers[quizId][currParticipant][order] ==
                    _correctOptionHashes[order]
                ) {
                    trueAnswerCounts[quizId][currParticipant]++;
                    if (
                        trueAnswerCounts[quizId][currParticipant] >
                        maxCorrectAnswerCount
                    ) {
                        maxCorrectAnswerCount = trueAnswerCounts[quizId][
                            currParticipant
                        ];
                    }
                    // calculate each player correct count
                }
            }
        }

        // end of check loop

        for (uint256 i = 0; i < quizParticipants[quizId].length; i++) {
            address currentParticipant = quizParticipants[quizId][i];
            if (
                trueAnswerCounts[quizId][currentParticipant] ==
                maxCorrectAnswerCount
            ) {
                winners[quizId].push(currentParticipant);
            }
        }

        uint256 reward = (quizzes[quizId].entryFee *
            quizParticipants[quizId].length) / winners[quizId].length;

        for (uint256 i = 0; i < winners[quizId].length; i++) {
            address currentWinner = winners[quizId][i];
            (payable(currentWinner)).transfer(reward);
        }
    }

    function calculateQuestionHash(string memory qText, address creatorAddress)
        public
        pure
        returns (bytes32 prefixedHash)
    {
        prefixedHash = keccak256(abi.encodePacked(qText, creatorAddress));
    }

    function getQuizParticipants(uint256 quizId) public view returns(address [] memory){
        return quizParticipants[quizId];
    }

    function calculateOptionHash(
        bytes32 questionHash,
        string memory optionText,
        bool isCorrect,
        address creatorAddress
    ) public pure returns (bytes32 prefixedHash) {
        prefixedHash = keccak256(
            abi.encodePacked(
                questionHash,
                optionText,
                isCorrect,
                creatorAddress
            )
        );
    }

    constructor(address _triavaManager) {
        triavaManager = _triavaManager;
    }
}
