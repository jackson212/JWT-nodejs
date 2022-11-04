require("dotenv").config()


const express =require('express')

const app= express()

const jwt=require('jsonwebtoken')

app.use(express.json())

const posts=[

 {
   
   username:"jackson",
   title:"post1"

 },
 {
   
    username:"jack",
    title:"post2"
 
  }

]
let rtokens=[]
app.delete('/logout',(req,res)=>{

 rtokens=rtokens.filter(token=>token !== req.body.token)
  

 
 

})
app.get('/pots',  authenticateToken,(req,res)=>{



res.json(posts.filter(poster=>poster.username===req.user.name))
 

})



app.post('/token',(req,res)=>{

 const Rtoken=req.body.token
 jwt.verify(Rtoken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{

  if(err){

   return res.json("some problem")

  }
   if(!Rtoken.includes(rtokens)){

    return res.json("error")
   }
   console.log(user)
 const accesstoken=generateAccess({name:user.name})

   res.json({accesstoken:accesstoken})


})
})

app.post('/login' ,(req,res)=>{

 const username=req.body.name

 const user={name:username}
 

 const accesstoken=generateAccess(user)
  
 const refreshToken=jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)

  rtokens.push(refreshToken)
 
 res.json({accesstoken:accesstoken ,refreshToken:refreshToken  })
    
    })

 function generateAccess(user ){
return jwt.sign(user,process.env.ACCESS_JWT)


 }


  function authenticateToken(req,res,next){

    const token= req.headers['authorization']


    
     
   if(token==null){

   return res.json("nothing")
   }
 
   jwt.verify(token,process.env.ACCESS_JWT,(err,user)=>{

     if(err){

      return res.json("antoher problem")


     }
     req.user=user
      
     next()
   })

  }



app.listen(3000)