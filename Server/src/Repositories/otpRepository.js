const db= require("../Config/db");
class otpRepository{
     async saveOtp(email,otp, purpose, expiresAt){
        const sql=`insert into otp(email,otp, purpose, expires_at) values (?,?,?,?)`;
        const [result]=await db.query(sql,[email,otp, purpose,expiresAt]);
        return result.insertId;
     }
     async findOtp(email,otp, purpose){
        const sql=`select * from otp where email=? and otp=? and purpose=? limit 1`;
        const [rows]=await db.query(sql,[email,otp,purpose]);
        return rows[0];
     }
     async deleteOtp(email, purpose){
        const sql=`
        delete from otp where email=? and purpose=?`;
        const [result]=await db.query(sql,[email,purpose]);
        return result.affectedRows;
     }
      async deleteExpiredOtps() {
        const sql = `
            DELETE FROM otp
            WHERE expires_at < NOW()
        `;

        const [result] = await db.query(sql);

        return result.affectedRows;
    }
}
module.exports=new otpRepository();