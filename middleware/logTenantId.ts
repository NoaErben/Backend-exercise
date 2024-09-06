import { Request, Response, NextFunction } from 'express';

export function logTenantId(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['tenantid'];
    if (tenantId) {
        console.log(`Got an HTTP request for ${tenantId}`);
    } else {
        console.warn('No TENANT_ID header found in the request');
    }
    next();
}
