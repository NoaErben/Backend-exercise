"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logTenantId = logTenantId;
function logTenantId(req, res, next) {
    const tenantId = req.headers['tenantid'];
    if (tenantId) {
        console.log(`Received request for TENANT_ID: ${tenantId}`);
    }
    else {
        console.warn('No TENANT_ID header found in the request');
    }
    next();
}
