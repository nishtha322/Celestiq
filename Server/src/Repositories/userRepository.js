const db=require("../Config/db");

class UserRepository{
    async createUser(userData){
        const sql=`
        insert into users (name,email, password, role, profile_image) values(?,?,?,?,?)`;
        const [result]= await db.query(sql,[userData.name,
            userData.email,
            userData.password,
            userData.role,
            userData.profile_image
        ]);
        return result.insertId;
    }
      async  findUserByEmail(email) {
        const sql=`select * from users where email=?`;
        const [result]=await db.query(sql,[email]);
        return result[0];
      }

   async findUserById(userId) {
     const sql=`select * from users where id=?`;
        const [result]=await db.query(sql,[userId]);
        return result[0];


    }

  async updatePassword(userId, hashedPassword) {
    const sql = `
        UPDATE users
        SET password = ?
        WHERE id = ?
    `;

    const [result] = await db.query(sql, [
        hashedPassword,
        userId
    ]);

    return result.affectedRows;
}

   async updateProfile(userId, userData) {
           const sql=`update users set name=?, profile_image=? where id=?`;
             const [result]=await db.query(sql,[userData.name,
    userData.profile_image,userId]);
                 return result.affectedRows;


    }

}
module.exports=new UserRepository();