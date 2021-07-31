const LoginApi = (url, user, pass) => (
    fetch(url+'wp-json/meup/v1/login/',
    {   
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            
        },
        body: JSON.stringify({ 
            user: user, 
            pass: pass,
        })
    })
    .then( res => res.json() )
    
    
);

module.exports = LoginApi;
