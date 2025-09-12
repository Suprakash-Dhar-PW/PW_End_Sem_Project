const { validationResult } = require('express-validator');

/**
 * DSA Controller
 * Handles all DSA-related operations including problems, leaderboard, and submissions
 */
const dsaController = {
  /**
   * Get all DSA problems
   * @route GET /api/dsa/problems
   * @access Private
   */
  getAllProblems: async (req, res) => {
    try {
      // This will be implemented with database integration
      // For now, return a mock response
      res.json({
        success: true,
        problems: [
          {
            id: 1,
            title: 'Two Sum',
            difficulty: 'Easy',
            category: 'Arrays',
            description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            title: 'Valid Parentheses',
            difficulty: 'Medium',
            category: 'Stacks',
            description: 'Given a string s containing just the characters ( ) { } [ ], determine if the input string is valid.',
            createdAt: new Date().toISOString()
          }
        ]
      });
    } catch (error) {
      console.error('Error in getAllProblems:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Get DSA problem by ID
   * @route GET /api/dsa/problems/:id
   * @access Private
   */
  getProblemById: async (req, res) => {
    try {
      const { id } = req.params;
      // This will be implemented with database integration
      // For now, return a mock response
      res.json({
        success: true,
        problem: {
          id: parseInt(id),
          title: 'Two Sum',
          difficulty: 'Easy',
          category: 'Arrays',
          description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
          examples: [
            {
              input: 'nums = [2,7,11,15], target = 9',
              output: '[0,1]',
              explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
            }
          ],
          constraints: [
            '2 <= nums.length <= 10^4',
            '-10^9 <= nums[i] <= 10^9',
            '-10^9 <= target <= 10^9',
            'Only one valid answer exists.'
          ],
          createdAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error in getProblemById:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Create a new DSA problem
   * @route POST /api/dsa/problems
   * @access Admin
   */
  createProblem: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, difficulty, category, description, examples, constraints } = req.body;
      
      // This will be implemented with database integration
      // For now, return a mock response
      res.status(201).json({
        success: true,
        problem: {
          id: Math.floor(Math.random() * 1000),
          title,
          difficulty,
          category,
          description,
          examples,
          constraints,
          createdAt: new Date().toISOString(),
          createdBy: req.user.id
        }
      });
    } catch (error) {
      console.error('Error in createProblem:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Update a DSA problem
   * @route PUT /api/dsa/problems/:id
   * @access Admin
   */
  updateProblem: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, difficulty, category, description, examples, constraints } = req.body;
      
      // This will be implemented with database integration
      // For now, return a mock response
      res.json({
        success: true,
        problem: {
          id: parseInt(id),
          title,
          difficulty,
          category,
          description,
          examples,
          constraints,
          updatedAt: new Date().toISOString(),
          updatedBy: req.user.id
        }
      });
    } catch (error) {
      console.error('Error in updateProblem:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Delete a DSA problem
   * @route DELETE /api/dsa/problems/:id
   * @access Admin
   */
  deleteProblem: async (req, res) => {
    try {
      const { id } = req.params;
      
      // This will be implemented with database integration
      // For now, return a mock response
      res.json({
        success: true,
        message: `Problem with ID ${id} deleted successfully`
      });
    } catch (error) {
      console.error('Error in deleteProblem:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Get DSA leaderboard
   * @route GET /api/dsa/leaderboard
   * @access Private
   */
  getLeaderboard: async (req, res) => {
    try {
      // This will be implemented with database integration
      // For now, return a mock response
      res.json({
        success: true,
        leaderboard: [
          {
            userId: 1,
            username: 'john_doe',
            points: 350,
            problemsSolved: 15,
            rank: 1
          },
          {
            userId: 2,
            username: 'jane_smith',
            points: 320,
            problemsSolved: 14,
            rank: 2
          },
          {
            userId: 3,
            username: 'alex_wilson',
            points: 280,
            problemsSolved: 12,
            rank: 3
          }
        ]
      });
    } catch (error) {
      console.error('Error in getLeaderboard:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Update user points on leaderboard
   * @route PUT /api/dsa/leaderboard/:userId
   * @access Admin
   */
  updateUserPoints: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { userId } = req.params;
      const { points } = req.body;
      
      // This will be implemented with database integration
      // For now, return a mock response
      res.json({
        success: true,
        user: {
          userId: parseInt(userId),
          points: parseInt(points),
          updatedAt: new Date().toISOString(),
          updatedBy: req.user.id
        }
      });
    } catch (error) {
      console.error('Error in updateUserPoints:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  /**
   * Submit a DSA problem solution
   * @route POST /api/dsa/submissions
   * @access Private
   */
  submitSolution: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { problemId, solution } = req.body;
      
      // This will be implemented with database integration and solution validation
      // For now, return a mock response
      res.status(201).json({
        success: true,
        submission: {
          id: Math.floor(Math.random() * 1000),
          problemId: parseInt(problemId),
          userId: req.user.id,
          solution,
          status: 'Accepted', // Could be 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', etc.
          runtime: '5ms',
          memory: '42.1 MB',
          submittedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error in submitSolution:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = dsaController;