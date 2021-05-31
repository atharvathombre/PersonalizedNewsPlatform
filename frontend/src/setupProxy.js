const proxy = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(proxy('/newsapi', 
        { target: 'https://se-lab-backend-ptfwc.run-ap-south1.goorm.io' }
    ));
}