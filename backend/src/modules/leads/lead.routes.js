const express = require('express')
const router = express.Router()
const leadController = require('./lead.controller')
const authenticate = require('../../middleware/auth')

/**
 * @swagger
 * tags:
 *   name: Leads
 *   description: Property inquiry endpoints
 */

/**
 * @swagger
 * /api/leads:
 *   post:
 *     summary: Send inquiry for a property
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - property_id
 *               - message
 *             properties:
 *               property_id:
 *                 type: integer
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inquiry sent successfully
 *       409:
 *         description: Duplicate inquiry
 *       429:
 *         description: Too many inquiries
 */
router.post('/', authenticate, leadController.createLead)

/**
 * @swagger
 * /api/leads/received:
 *   get:
 *     summary: Get all inquiries received (as property owner)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of received inquiries
 */
router.get('/received', authenticate, leadController.getMyLeads)

/**
 * @swagger
 * /api/leads/sent:
 *   get:
 *     summary: Get all inquiries sent (as buyer)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sent inquiries
 */
router.get('/sent', authenticate, leadController.getMySentLeads)

/**
 * @swagger
 * /api/leads/{id}/status:
 *   put:
 *     summary: Update inquiry status (owner only)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, responded, closed]
 *     responses:
 *       200:
 *         description: Status updated
 *       403:
 *         description: Unauthorized
 */
router.put('/:id/status', authenticate, leadController.updateLeadStatus)

module.exports = router