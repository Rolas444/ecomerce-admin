import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import NextAuth, { getServerSession } from 'next-auth'
// import AppleProvider from 'next-auth/providers/apple'
// import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
// import EmailProvider from 'next-auth/providers/email'
const adminEmails = ['7200ws@gmail.com'];


export const authOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [

    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  adapater: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({session, token, user})=>{
      if (adminEmails.includes(session?.user?.email)){
      return session;
      }
      else{
        return false;    
      } 
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res){
  const session =await  getServerSession(req, res, authOptions);
  
  if(!adminEmails.includes(session?.user?.email)){
    res.status(401);
    res.end();
    throw "not an admin";
  }
}