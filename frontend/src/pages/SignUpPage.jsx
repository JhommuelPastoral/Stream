import { useState } from "react"
import {useMutation, useQueryClient} from '@tanstack/react-query'
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";
import { signup } from "../lib/api.js";
export default function SignUpPage() {
  const [ischecked, setIsChecked] = useState(false);
  const [signupData, setSignupData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const queryClient = useQueryClient();
  
  const {mutate:signupMutation, isPending, error} = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["authUser"]});
      toast.success("Account created successfully");
    },
    onError: (error) => {
      toast.error(error.response.data);
    }
  });


  const handleSignupData = (e) => {
    e.preventDefault();
    if(ischecked){
      signupMutation(signupData);
    }
    else{
      toast.error("Please accept the terms and conditions");
    }
  };  

  const handleCheckbox = () => {
    setIsChecked(prev => !prev)
  };  
  return (
    <div  className="flex justify-center items-center h-screen font-Poppins">
      <div className="flex flex-col md:flex-row gap-[20px] max-w-[1200px] border rounded-2xl ">
        <div className="p-[20px] space-y-3 md:w-1/2">
          <p className="font-bold text-2xl bg-gradient-to-r from-[#2A7B9B] via-[#57C785] to-[#EDDD53] bg-clip-text text-transparent">Streamnify</p>
          <p className="font-semibold">Create an Account</p>
          <p className="text-sm">Join LangConnect and start your languange learning journey</p>
          <form onSubmit={handleSignupData}>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Full Name</legend>
              <input type="text" className="input w-full" placeholder="Ex. John Doe" onChange={(e)=>{setSignupData({...signupData, fullname: e.target.value})}} value={signupData.fullname} />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend" >Email</legend>
              <input type="text" className="input w-full"  placeholder="Ex. JohnDoe@gmail.com" onChange={(e)=>{setSignupData({...signupData, email: e.target.value})}} value={signupData.email} />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input type="password" className="input w-full" placeholder="Password" onChange={(e)=>{setSignupData({...signupData, password: e.target.value})}} value={signupData.password} />
              <p className="label"></p>
            </fieldset>
            <div className="flex gap-2 items-center">
              <input type="checkbox" className="checkbox" onChange={handleCheckbox} />
              <p className="text-sm">I aggree to the terms of service and privacy policy</p>
            </div>
            <button className="w-full bg-[rgb(21,142,63)] rounded-full mt-2.5 py-2.5 cursor-pointer">
              {isPending? (<><span className="loading loading-spinner loading-xs"> </span> Loading...</> ) : ('Create Account') }
            </button>
            <p className="text-sm text-center mt-[10px]">Already have an account? <a href="/login" className="text-[rgb(21,142,63)]">Sign in</a></p>
          </form>
        </div>

        <div className="hidden md:flex justify-center items-center bg-[rgb(23,38,25)] rounded-br-2xl rounded-tr-2xl w-1/2">
          <img src='/Call.png' className="w-[500px] h-full "  />
        </div>

      </div>
    </div> 
 )
}
