const axios = require('axios')

module.exports = async (req, res) => {
    const mutation = `
        mutation login($email: String!, $password: String!) { 
            login( email: $email, password: $password ) 
        }`

    if (!req.body.email || !req.body.password) {
        res.redirect('/auth/login')
        return;
    }

    try {
        const { response } = await axios.post(process.env.GRAPHQL_ENDPOINT, 
            { 
                query: mutation,
                variables: {
                    email: req.body.email,
                    password: req.body.password
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            });   
        const jwtToken = response.data.login
        res.cookie('jwtToken', jwtToken, { maxAge: 900000, httpOnly: true });

        res.redirect('/')
    } catch(e) {
        console.log(e.response.data.errors)
        res.redirect('/auth/login')
    }   
}