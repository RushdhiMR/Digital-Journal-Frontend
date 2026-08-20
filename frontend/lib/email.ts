import nodemailer from 'nodemailer';

// SMTP Transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER || '',
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS || '',
  },
});

export async function sendSignInNotificationEmail(email: string, name: string) {
  const timeString = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #000000; padding: 24px; text-align: center; border-top: 6px solid #165c61;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; text-transform: uppercase;">London BigBen Network</h1>
      </div>
      
      <div style="padding: 32px; color: #27272a; line-height: 1.6;">
        <h2 style="color: #18181b; margin-top: 0; font-size: 20px;">Security Alert: Successful Sign-In</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>We detected a new successful sign-in to your London BigBen Network account associated with <strong>${email}</strong>.</p>
        
        <div style="background-color: #f4f4f5; border-left: 4px solid #BF1E2D; padding: 16px; margin: 24px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; color: #52525b;"><strong>Sign-In Time:</strong> ${timeString}</p>
          <p style="margin: 6px 0 0 0; font-size: 14px; color: #52525b;"><strong>Account Email:</strong> ${email}</p>
          <p style="margin: 6px 0 0 0; font-size: 14px; color: #52525b;"><strong>Status:</strong> Authenticated</p>
        </div>

        <p style="font-size: 14px; color: #71717a;">If this was you, no further action is required. If you did not initiate this sign-in, please reset your password immediately.</p>
      </div>

      <div style="background-color: #f4f4f5; padding: 16px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #e4e4e7;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} London BigBen Network. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail({
        from: `"London BigBen Network Security" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Security Alert: Successful Sign-In to London BigBen Network`,
        html: htmlContent,
      });
      console.log(`[Email Service] Sent sign-in notification email to ${email}`);
    } else {
      console.log(`[Email Notification Triggered] Email for ${email} (${name}). Set SMTP_USER and SMTP_PASS in .env.local to send live inbox emails.`);
    }
    return true;
  } catch (error) {
    console.error(`[Email Service Error] Failed to send email to ${email}:`, error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #000000; padding: 24px; text-align: center; border-top: 6px solid #165c61;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; text-transform: uppercase;">London BigBen Network</h1>
      </div>
      
      <div style="padding: 32px; color: #27272a; line-height: 1.6;">
        <h2 style="color: #18181b; margin-top: 0; font-size: 20px;">Welcome to London BigBen Network!</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Thank you for creating an account with London BigBen Network. Your account <strong>${email}</strong> has been successfully registered.</p>
        
        <p style="font-size: 14px; color: #71717a;">You now have full access to our independent journalism, industry insights, and technology analysis.</p>
      </div>

      <div style="background-color: #f4f4f5; padding: 16px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #e4e4e7;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} London BigBen Network. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail({
        from: `"London BigBen Network Team" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Welcome to London BigBen Network, ${name}!`,
        html: htmlContent,
      });
    }
    return true;
  } catch (error) {
    console.error(`[Email Service Error] Failed to send welcome email to ${email}:`, error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #000000; padding: 24px; text-align: center; border-top: 6px solid #BF1E2D;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; text-transform: uppercase;">London BigBen Network</h1>
      </div>
      
      <div style="padding: 32px; color: #27272a; line-height: 1.6;">
        <h2 style="color: #18181b; margin-top: 0; font-size: 20px;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password for your London BigBen Network account associated with <strong>${email}</strong>.</p>
        
        <div style="margin: 28px 0; text-align: center;">
          <a href="${resetUrl}" style="background-color: #BF1E2D; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">Reset Password</a>
        </div>

        <p style="font-size: 13px; color: #71717a;">Or copy and paste this link into your browser:<br/><a href="${resetUrl}" style="color: #BF1E2D;">${resetUrl}</a></p>
        
        <p style="font-size: 13px; color: #71717a; margin-top: 24px;">This reset link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email.</p>
      </div>

      <div style="background-color: #f4f4f5; padding: 16px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #e4e4e7;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} London BigBen Network. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail({
        from: `"London BigBen Network Security" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Reset Your London BigBen Network Password`,
        html: htmlContent,
      });
      console.log(`[Email Service] Sent password reset email to ${email}`);
    } else {
      console.log(`[Password Reset Triggered] Link for ${email}: ${resetUrl}`);
    }
    return true;
  } catch (error) {
    console.error(`[Email Service Error] Failed to send password reset email to ${email}:`, error);
    return false;
  }
}

