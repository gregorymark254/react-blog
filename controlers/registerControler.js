const userDB = {
    users: require('../model/user.json'),
    setUsers: function(data) {this.users = data}
}

const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')


const handleNewUser = async(req,res) => {
    const { user,pwd } = req.body 
    if(!user || !pwd) return res.status(400).json({'message': 'Username and Password Required'})

    const duplicate = userDB.users.find(person => person.username === user)
    if(duplicate) return res.status(409)
    try{
        const hashedPwd = await bcrypt.hash(pwd, 10)
        //store new user
        const newUser = {"username":user, "password": hashedPwd}
        userDB.setUsers([...userDB.users, newUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'user.json'),
            JSON.stringify(userDB.users)
        )
        console.log(userDB.users)
        res.status(201).json({'Success': `New user ${user} created`})
    }catch (err){
        res.status(500).json({'message': err.message})
    }
}

module.exports = { handleNewUser }