const User = require("../model/user");

module.exports.renderSingupForm = (req,res) => {
    res.render("users/signup.ejs");
};


module.exports.singUp = async(req,res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email,username});
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "welcome to airbnb");
            res.redirect("/listings");
      });
    }catch(e){
        req.flash("error",e.massage);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req,res) => {
    req.flash("success","welcome back to airbnb!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

};

module.exports.logout = (req,res,next) => {
    req.logOut((err) => {
        if(err){
            return next(err);
        }
        req.flash("success","your are logged out!");
        res.redirect("/listings");
    });

};
