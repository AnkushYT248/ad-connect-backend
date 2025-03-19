import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ankushthakur2682@gmail.com',
    pass: 'jpfk btif fjxs ycjs', // Use an app password, not your email password
  },
});

export { transporter };