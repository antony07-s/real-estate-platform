const leadService = require("./lead.service");
const Joi = require("joi");

// ─── Validation Schema ──────────────────────────────
const leadSchema = Joi.object({
  property_id: Joi.number().integer().required(),
  message: Joi.string().min(10).max(500).required(),
});

const statusSchema = Joi.object({
  status: Joi.string().valid("pending", "responded", "closed").required(),
});

// ─── Create Lead ────────────────────────────────────
const createLead = async (req, res, next) => {
  try {
    const { error, value } = leadSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const lead = await leadService.createLead(req.user.userId, value);

    res.status(201).json({
      success: true,
      message: "Inquiry sent successfully",
      data: lead,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get Leads Received (as owner) ──────────────────
const getMyLeads = async (req, res, next) => {
  try {
    const leads = await leadService.getMyLeads(req.user.userId);

    res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get Leads Sent (as buyer) ──────────────────────
const getMySentLeads = async (req, res, next) => {
  try {
    const leads = await leadService.getMySentLeads(req.user.userId);

    res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Update Lead Status ─────────────────────────────
const updateLeadStatus = async (req, res, next) => {
  try {
    const { error, value } = statusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const lead = await leadService.updateLeadStatus(
      req.params.id,
      req.user.userId,
      value.status,
    );

    res.status(200).json({
      success: true,
      message: "Lead status updated",
      data: lead,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createLead,
  getMyLeads,
  getMySentLeads,
  updateLeadStatus,
};
