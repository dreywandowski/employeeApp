   // verify user if its admin
   
   module.exports = (req, res, next) => {
 const role = req.user.role;

  if(role === "admin"){
    next()
  }
  else{
    res.status(404).json({'message' : 'This user is not authorized to use this route!', 
            'status': 0});
  }
  

  };
  