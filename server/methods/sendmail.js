/**
 *
 * Run:
 *
 */
const mailjet = require('node-mailjet').apiConnect(
    "3e8584fb059a0725493771f25db32207",
    "9c0a4887009e683d526912e8d5c297f2"
)

module.exports = function (email, token, callback) {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: 'dipti.verma@ssipmt.com',
                    Name: 'dipti verma',
                },
                To: [
                    {
                        Email: email,
                        Name: 'No Need',
                    },
                ],
                Subject: 'Verify your Account',
                TextPart: 'To access your account you need to verify your email.',
                HTMLPart: '<h3>Verification of account</h3><a href= "http://localhost:3000/verifymail/?token="+token >Click to Verify</a>!<br />Login to you account after verifying!',
            },
        ],
    })
    request
        .then(result => {
            console.log(result.body)
            callback(null, result.body)
        })
        .catch(err => {
            console.log(err)
            callback(err, null);
        })

}