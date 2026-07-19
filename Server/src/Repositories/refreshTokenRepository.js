const db=require("../Config/db");
class RefreshTokenRepository{
    async saveRefreshToken(userId, refreshToken, expiresAt) {
        const sql=`
        insert into refresh_tokens(user_id, refresh_token, expires_at) values(?,?,?)`;
        const [result]=await db.query(sql,[userId, refreshToken, expiresAt]);
        return result.insertId;;
    }

    async findRefreshToken(refreshToken) {
        const sql=`select * from refresh_tokens where refresh_token=?`;
        const [result]= await db.query(sql,[refreshToken]);
        return result[0];
    }

    async deleteRefreshToken(refreshToken) {
       const sql=`delete from refresh_tokens where refresh_token=?`;
        const [result]= await db.query(sql,[refreshToken]);
        return result.affectedRows;


    }

    async deleteRefreshTokensByUserId(userId) {
        const sql=`delete from refresh_tokens where user_id=?`;
         const [result]= await db.query(sql,[userId]);
        return result.affectedRows;
    }
}
module.exports=new RefreshTokenRepository();