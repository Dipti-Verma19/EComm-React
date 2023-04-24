const mailjet = require('node-mailjet').apiConnect(
    "3e8584fb059a0725493771f25db32207",
    "9c0a4887009e683d526912e8d5c297f2"
)

module.exports = function (email, password, callback) {
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
                Subject: 'Get Your Password',
                TextPart: 'Password you provided while registering in our website',
                HTMLPart: `Password you provided while registering in our website <br>Your Password : '${password}'`,
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