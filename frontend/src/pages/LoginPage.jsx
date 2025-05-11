import { useState } from "react"
import {useMutation, useQueryClient} from '@tanstack/react-query'
import toast from "react-hot-toast";
import { signin } from "../lib/api.js";
export default function LoginPage() {
  const [siginpData, setSignupData] = useState({
    email: "",
    password: ""
  });
  const queryClient = useQueryClient();
  
  const {mutate:signupMutation, isPending, error} = useMutation({
    mutationFn: signin,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["authUser"]});
      toast.success("Sign In successfully");
    },
    onError: (error) => {
      toast.error(error.message );
    }
  });


  const handleSigninData = (e) => {
    e.preventDefault();
    signupMutation(siginpData);
  };  


  return (
    <div  className="flex justify-center items-center h-screen font-Poppins">
      <div className="flex flex-col md:flex-row gap-[20px] max-w-[1200px] border rounded-2xl ">
        <div className="p-[20px] space-y-3 md:w-1/2">
          <p className="font-bold text-2xl bg-gradient-to-r from-[#2A7B9B] via-[#57C785] to-[#EDDD53] bg-clip-text text-transparent">Streamnify</p>
          <p className="font-semibold">Create an Account</p>
          <p className="text-sm">Join LangConnect and start your languange learning journey</p>
          <form onSubmit={handleSigninData}>

            <fieldset className="fieldset">
              <legend className="fieldset-legend" >Email</legend>
              <input type="text" className="input w-full"  placeholder="Ex. JohnDoe@gmail.com" onChange={(e)=>{setSignupData({...siginpData, email: e.target.value})}} value={siginpData.email} />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input type="password" className="input w-full" placeholder="Password" onChange={(e)=>{setSignupData({...siginpData, password: e.target.value})}} value={siginpData.password} />
              <p className="label"></p>
            </fieldset>

            <button className="w-full bg-[rgb(21,142,63)] rounded-full mt-2.5 py-2.5 cursor-pointer">
              {isPending? (<><span className="loading loading-spinner loading-xs"> </span> Loading...</> ) : ('Sign in') }
            </button>
            <p className="text-sm text-center mt-[10px]">Don't have an account? <a href="/signup" className="text-[rgb(21,142,63)]">Sign up</a></p>
          </form>
        </div>

        <div className="hidden md:flex justify-center items-center bg-[rgb(23,38,25)] rounded-br-2xl rounded-tr-2xl w-1/2">
          <img src='/Call.png' className="w-[500px] h-full "  />
        </div>

      </div>
    </div> 
 )
}
