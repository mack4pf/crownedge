const { Resend } = require('resend');

const RESEND_API_KEY = 're_UbPSSy2J_MyBrdszni2jJMkvFLNV7P6gS';
const RESEND_FROM_EMAIL = 'CrownEdge Broker <auth@crownedgebroker.pro>';

const resend = new Resend(RESEND_API_KEY);

async function testResend() {
    try {
        console.log('Testing Resend with key: re_Ub...7P6gS');
        const data = await resend.emails.send({
            from: RESEND_FROM_EMAIL,
            to: 'vitor@trutech.com',
            subject: 'Test Email',
            html: '<p>Test</p>'
        });
        console.log('Success:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error Details:', JSON.stringify(error, null, 2));
    }
}

testResend();
