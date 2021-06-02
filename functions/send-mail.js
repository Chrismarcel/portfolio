'use strict';

const dotenv = require('dotenv');
const iplocation = require('iplocation').default;
const nodemailer = require('nodemailer');

dotenv.config();

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true, 
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    try {
        await transporter.sendMail({
            to,
            subject,
            text,
            from: `"${process.env.EMAIL_USERNAME}" <${process.env.EMAIL}>`
        });
    } catch(error) {
        console.log(error);
        return error;
    }
}

exports.handler = function(event, context, callback) {
    console.log(event);
    console.log(context);
    callback(null, {});
}

// iplocation(info.remoteAddress)
// .then(({country, city, region, regionCode, countryCode, timezone}) => {
//     const text = `A user from ${city} in ${region}(${regionCode}), 
//                 ${country}(${countryCode}) ${timezone} visited.`;
//     const subject = `New user from ${city}, ${region}, ${country}`;
//     const to = process.env.RECEPIENT_EMAIL;
    
//     sendEmail(to, subject, text);
// })
// .catch(error => console.log(error));
