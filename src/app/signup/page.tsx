"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

export default function Signup() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState({ 
    email: "", 
    password: "", 
    phoneNumber: "", 
    firstName: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<"empty" | "weak" | "medium" | "strong">("empty");
  const [token, setToken] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchToken = async () => {
        try {
          const res = await fetch("/api/auth/token", {
            method: "GET",
            credentials: "include", // Ensures cookies are sent
          });
  
          const data = await res.json();
          if (data.token) {
            setToken(data.token);
            router.push("/dashboard"); // Redirect if token exists
          }
        } catch (error) {
          console.error("Error fetching token:", error);
        }
      };
  
      fetchToken();
    }, [router]);
    
  const checkPasswordStrength = (password: string) => {
    if (!password) {
      return "empty";
    }
    
    // Check for minimum length
    if (password.length < 8) {
      return "weak";
    }
    
    let score = 0;
    
    // Check for uppercase letters
    if (/[A-Z]/.test(password)) score++;
    
    // Check for lowercase letters
    if (/[a-z]/.test(password)) score++;
    
    // Check for numbers
    if (/[0-9]/.test(password)) score++;
    
    // Check for special characters
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score === 2) return "medium";
    if (score >= 3) return "strong";
    return "weak";
  };
  
  // Update password strength when password changes
  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(user.password));
  }, [user.password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Validate file size (e.g., limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large. Please select an image under 5MB.");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file.");
        return;
      }
      
      setAvatar(file);
      
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password strength before submission
    if (passwordStrength !== "strong") {
      setError("Please use a strong password for better security");
      toast.error("Strong password required");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      // Display uploading message if avatar is being uploaded
      if (avatar) {
        toast.loading("Uploading profile picture...");
      }
      
      // Combine the JSON and file data using FormData
      const formData = new FormData();
      
      // Append user data as individual fields
      Object.entries(user).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Append avatar if available
      if (avatar) {
        formData.append("avatar", avatar);
      }
      
      // Send the combined data
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      // Dismiss the loading toast
      toast.dismiss();

      // Try to parse JSON response
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch (err) {
          data = { message: text };
        }
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || "Something went wrong");
      }

      toast.success("User created successfully!");
      router.push("/login");
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  // Get password strength indicator color
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "strong":
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  // Get password strength message
  const getPasswordStrengthMessage = () => {
    switch (passwordStrength) {
      case "weak":
        return "Weak - Not allowed";
      case "medium":
        return "Medium - Not strong enough";
      case "strong":
        return "Strong - Good to go!";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-0">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
          Join <span className="text-blue-600">Goggins</span>
        </h1>
        <p className="text-sm text-gray-600 text-center mt-2">
          Start organizing your notes like never before!
        </p>

        {/* Sign-Up Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6" encType="multipart/form-data">
          {/* Avatar Upload - Improved Professional Version */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Profile Picture
            </label>
            <div className="flex flex-col items-center">
              <div 
                className="w-32 h-32 rounded-full relative overflow-hidden border-2 border-dashed hover:border-blue-400 cursor-pointer transition-colors duration-300 mb-4 group"
              >
                {avatarPreview ? (
                  <div className="relative w-full h-full">
                    <Image 
                      src={avatarPreview} 
                      alt="Avatar preview" 
                      fill
                      className="object-cover rounded-full"
                    />
                    <div 
                      className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center"
                      onClick={triggerFileInput}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="w-full h-full bg-gray-100 flex flex-col items-center justify-center rounded-full"
                    onClick={triggerFileInput}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs mt-2 text-gray-500">Click to upload</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              
              <div className="flex space-x-3">
                <button 
                  type="button" 
                  onClick={triggerFileInput}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  {avatarPreview ? "Change" : "Upload"}
                </button>
                
                {avatarPreview && (
                  <button 
                    type="button" 
                    onClick={removeAvatar}
                    className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                )}
              </div>
              
              {avatar && (
                <p className="text-xs text-gray-500 mt-2">
                  {avatar.name} ({Math.round(avatar.size / 1024)}KB)
                </p>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                Recommended: Square image, at least 200x200px
              </p>
            </div>
          </div>

          {/* Phone Number Input */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-2">
              Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={user.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password Input with Strength Meter */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
              placeholder="••••••••"
              required
            />
            
            {/* Password Strength Indicator */}
            {user.password && (
              <div className="mt-2">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getPasswordStrengthColor()} transition-all duration-300 ease-in-out`}
                    style={{ 
                      width: passwordStrength === "weak" ? "33%" : 
                             passwordStrength === "medium" ? "66%" : 
                             passwordStrength === "strong" ? "100%" : "0%" 
                    }}
                  ></div>
                </div>
                <p className={`text-xs mt-1 ${
                  passwordStrength === "weak" ? "text-red-600" : 
                  passwordStrength === "medium" ? "text-yellow-600" : 
                  passwordStrength === "strong" ? "text-green-600" : ""
                }`}>
                  {getPasswordStrengthMessage()}
                </p>
                
                {/* Password Requirements */}
                <div className="mt-2 text-xs text-gray-600">
                  <p>Password must contain:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li className={user.password.length >= 8 ? "text-green-600" : ""}>At least 8 characters</li>
                    <li className={/[A-Z]/.test(user.password) ? "text-green-600" : ""}>Upper case letters (A-Z)</li>
                    <li className={/[a-z]/.test(user.password) ? "text-green-600" : ""}>Lower case letters (a-z)</li>
                    <li className={/[0-9]/.test(user.password) ? "text-green-600" : ""}>Numbers (0-9)</li>
                    <li className={/[^A-Za-z0-9]/.test(user.password) ? "text-green-600" : ""}>Special characters (!@#$%^&*)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

          {/* Sign-Up Button */}
          <button
            type="submit"
            disabled={loading || passwordStrength !== "strong"}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        {/* Login & Home Links */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Log In
            </Link>
          </p>
          <Link href="/" className="inline-block text-xs px-3 py-1 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors mt-2">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}