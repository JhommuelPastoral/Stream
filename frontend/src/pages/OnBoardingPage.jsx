import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser.js"
import {completeOnboarding} from "../lib/api.js"
import toast from "react-hot-toast";
import { useState } from "react";
import { Shuffle } from 'lucide-react';
import {LANGUAGES, LANGUAGE_TO_FLAG}  from '../constant/index.js'
export default function OnBoardingPage() {
  const {authData} = useAuthUser();
  
  const [formState, setFormState] = useState({
    fullname: authData?.fullname || "",
    bio: authData?.bio || "",
    nativeLanguage: authData?.nativeLanguage || "",
    learningLanguage: authData?.learningLanguage || "",
    location: authData?.location || "",
    profilePic: authData?.profilePic || "",
  });
  const queryClient = useQueryClient();

  const {mutate:onboardingMutation, isPending} =  useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["authUser"]});
      toast.success("Account created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const handleSubmit = async(e) => {
    e.preventDefault();
    onboardingMutation(formState);
  }

  const handleRandomAvatar = () => {
    const randomAvatar = `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 100) + 1}.png}`;
    setFormState({...formState, profilePic: randomAvatar});
  }


  return (
      <div  className="flex justify-center items-center min-h-screen max-w-[700px] mx-auto font-Poppins">
        <div  className="flex flex-col justify-center items-center w-full border p-[30px] rounded-2xl space-y-5 ">
          <div className="flex flex-col gap-4 justify-center items-center w-full ">
              <h1 className="font-bold text-center text-xl"> Complete Your Profile</h1>
              <img src={formState.profilePic} alt="Profile" className="w-[100px] h-[100px] rounded-full" />
              <button onClick={handleRandomAvatar} className="bg-[rgb(30,184,171)] p-[10px] rounded-full text-black cursor-pointer flex items-center gap-[10px]"> <span> <Shuffle  /></span> Generate Random Avatar</button>
          </div>

          <form className="w-full flex flex-col gap-[20px]" onSubmit={handleSubmit}>
            <fieldset className="fieldset">
              <legend className="fieldset-legend ">Full Name</legend>
              <input type="text" className="input w-full rounded-full  " placeholder="Type here" value={formState.fullname} onChange={(e) => setFormState({...formState, fullname: e.target.value})} />
            </fieldset>
            <div>
              <label htmlFor="bio">Bio</label>
              <textarea className="textarea w-full rounded-xl resize-none" id="bio" placeholder="Bio" value={formState.bio} onChange={(e) => setFormState({...formState, bio: e.target.value})}></textarea>
            </div>

            <div className="flex w-full gap-[10px]">
              <div className="w-1/2">
                <p> Native Language</p>
                <select 
                  className="select rounded-full" 
                  value={formState.nativeLanguage} 
                  onChange={(e) => setFormState({...formState, nativeLanguage: e.target.value})}
                >
                  <option disabled value="">Pick a Native Language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              <div className="w-1/2">
                <p> Learning Language</p>
                <select  className="rounded-full select" value={formState.learningLanguage} onChange={(e) => setFormState({...formState, learningLanguage: e.target.value})}>
                  <option disabled={true}>Pick a Language</option>
                  {LANGUAGES.map((lang,index) => (
                    <option key={index}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="loc">Location</label>
              <input type="text" id="loc" className="input w-full rounded-full" value={formState.location} onChange={(e) => setFormState({...formState, location: e.target.value})} placeholder="City, Country" />
            </div>
            <button className="bg-[rgb(29,184,83)] p-[10px] rounded-full  cursor-pointer">Complete Onboarding</button>
          </form>


       </div>

      </div>

  )
}
