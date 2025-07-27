import nodemailer from 'nodemailer';
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
} from '../sequelize/config/env.config';
import { logError, logger } from '../logs';
import path from 'path';
import fs from 'fs';
import ejs from 'ejs';
import { DynamicObjectType } from '../types';
import _ from 'lodash';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  // host: SMTP_HOST || 'smtp.gmail.com', // Default to Gmail if not specified
  // port: SMTP_PORT || 587, // Default to 587 if not specified
  // secure: SMTP_SECURE, // true for 465, false for other ports
  auth: {
    type: 'OAuth2',
    user: SMTP_USER,
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    refreshToken: GOOGLE_REFRESH_TOKEN,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

export const sendEmail = async (data: {
  to: string[];
  subject: string;
  text: string;
  isForCustomHtml?: boolean;
  emailTemplateName?: string;
  replacement?: DynamicObjectType;
  htmlString?: string;
}) => {
  try {
    const {
      to,
      subject,
      text,
      htmlString,
      isForCustomHtml = false,
      emailTemplateName,
    } = data;

    if (!to || !_.isArray(to) || to.length === 0) {
      throw new Error('Recipient email address is required');
    }
    let html = '';
    if (isForCustomHtml) {
      if (!htmlString) {
        throw new Error('HTML string is required for custom HTML emails');
      }
      html = htmlString;
    } else {
      if (emailTemplateName) {
        throw new Error(
          'Email template is required for non-custom HTML emails',
        );
      }
      // Read and render the EJS template
      const templatePath = path.join(__dirname, `${emailTemplateName}.ejs`);
      const template = fs.readFileSync(templatePath, 'utf-8');
      html = ejs.render(template); // Use the provided email template directly
    }

    const mailOptions = {
      from: SMTP_USER,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info('[sendEmail:]Email sent: %o', info);
  } catch (error) {
    logError({ err: error, message: 'Error in sendEmail function' });
  }
};
