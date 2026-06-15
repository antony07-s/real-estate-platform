const express = require('express')
const router = express.Router()
const propertyController = require('./property.controller')
const authenticate = require('../../middleware/auth')

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: Property listing endpoints
 */

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all properties with search, filter and pagination
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *       - in: query
 *         name: property_type
 *         schema:
 *           type: string
 *           enum: [apartment, house, villa, plot]
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [price, created_at, area_sqft, bedrooms]
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of properties
 */
router.get('/', getAllPropertiesHandler)

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: Create a new property listing
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *               - property_type
 *               - city
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               property_type:
 *                 type: string
 *                 enum: [apartment, house, villa, plot]
 *               bedrooms:
 *                 type: integer
 *               bathrooms:
 *                 type: integer
 *               area_sqft:
 *                 type: number
 *               city:
 *                 type: string
 *               locality:
 *                 type: string
 *               address:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Property created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, propertyController.createProperty)

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get property by ID with similar properties
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Property details with similar properties
 *       404:
 *         description: Property not found
 */
router.get('/:id', propertyController.getPropertyById)

/**
 * @swagger
 * /api/properties/{id}:
 *   put:
 *     summary: Update property (owner only)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Property updated successfully
 *       403:
 *         description: Unauthorized
 */
router.put('/:id', authenticate, propertyController.updateProperty)

/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     summary: Delete property (owner only)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       403:
 *         description: Unauthorized
 */
router.delete('/:id', authenticate, propertyController.deleteProperty)

/**
 * @swagger
 * /api/properties/{id}/similar:
 *   get:
 *     summary: Get similar properties
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Similar properties list
 */
router.get('/:id/similar', propertyController.getSimilarProperties)

function getAllPropertiesHandler(req, res, next) {
  propertyController.getAllProperties(req, res, next)
}

module.exports = router