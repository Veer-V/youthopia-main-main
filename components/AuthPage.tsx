import * as React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { FiUser, FiPhone, FiLock, FiCheckCircle, FiCircle, FiEye, FiEyeOff, FiUpload, FiCamera, FiRepeat, FiShield, FiInfo } from 'react-icons/fi';
import { FaGraduationCap, FaStream, FaSchool } from 'react-icons/fa';
import { stepVariants, pageTransition, itemSpringUp } from '../utils/animations.ts';
import { useAuth } from '../contexts/AuthContext.tsx';
import Illustration from './Illustration.tsx';

type RegistrationStep = 'details' | 'photo' | 'visaGrab';
type AuthMode = 'login' | 'register' | 'forgotPassword' | 'admin';
type ResetStep = 'contact' | 'password';


// Reusable Spinner Component
const Spinner = ({ className = "h-6 w-6 text-brand-dark-blue" }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const shakeVariants: Variants = {
    shake: { x: [0, -6, 6, -6, 0], transition: { duration: 0.4, ease: "easeInOut" } },
    stop: { x: 0 }
};

// Reusable Input Field Component with Floating Label
const InputField = ({
    id,
    icon,
    type = "text",
    label,
    value,
    onChange,
    disabled = false,
    name,
    isPassword = false,
    isVisible = false,
    onVisibilityChange,
    error,
}: {
    id: string;
    icon: React.ReactNode;
    type?: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    name: string;
    isPassword?: boolean;
    isVisible?: boolean;
    onVisibilityChange?: () => void;
    error?: string;
}) => {
    const inputType = isPassword ? (isVisible ? 'text' : 'password') : type;
    const [isFocused, setIsFocused] = React.useState(false);
    const hasError = !!error;

    return (
        <div>
            <motion.div
                className="relative"
                animate={hasError ? "shake" : "stop"}
                variants={shakeVariants}
            >
                <motion.div
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none"
                    animate={{ color: isFocused ? '#205295' : hasError ? '#EF4444' : '#9CA3AF', scale: isFocused ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    {icon}
                </motion.div>
                <input
                    type={inputType}
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={disabled}
                    className={`peer w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-700 border-2 rounded-lg text-brand-dark-blue dark:text-gray-100 focus:outline-none transition duration-300 placeholder-transparent ${hasError
                        ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-brand-blue dark:focus:border-brand-light-blue'
                        }`}
                    placeholder={label}
                    required
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${id}-error` : undefined}
                />
                <motion.label
                    htmlFor={id}
                    className="absolute top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 px-1 text-base transition-all duration-300 ease-in-out pointer-events-none"
                    animate={{
                        top: isFocused || value ? "-0.65rem" : "50%",
                        left: isFocused || value ? "2.25rem" : "2.5rem",
                        fontSize: isFocused || value ? "0.875rem" : "1rem",
                        color: isFocused ? (hasError ? '#EF4444' : '#205295') : (hasError ? '#EF4444' : '#6B7280')
                    }}
                >
                    {label}
                </motion.label>
                {isPassword && (
                    <button
                        type="button"
                        onClick={onVisibilityChange}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-blue dark:hover:text-brand-light-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-full p-1"
                        aria-label={isVisible ? "Hide password" : "Show password"}
                    >
                        {isVisible ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                )}
            </motion.div>
            <AnimatePresence>
                {hasError && (
                    <motion.p
                        id={`${id}-error`}
                        className="mt-1 ml-2 text-xs font-semibold text-red-500"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

// Reusable Select Field Component
const SelectField: React.FC<{
    id: string;
    icon: React.ReactNode;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    name: string;
    error?: string;
    children: React.ReactNode;
}> = ({ id, icon, label, value, onChange, name, error, children }) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasError = !!error;

    return (
        <div>
            <motion.div
                className="relative"
                animate={hasError ? "shake" : "stop"}
                variants={shakeVariants}
            >
                <motion.div
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none"
                    animate={{ color: isFocused ? '#205295' : hasError ? '#EF4444' : '#9CA3AF', scale: isFocused ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    {icon}
                </motion.div>
                <select
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`peer w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-700 border-2 rounded-lg text-brand-dark-blue dark:text-gray-100 focus:outline-none transition duration-300 appearance-none ${hasError
                        ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-brand-blue dark:focus:border-brand-light-blue'
                        } ${!value ? 'text-gray-500' : 'text-brand-dark-blue dark:text-gray-100'}`}
                    required
                    aria-invalid={hasError}
                    aria-describedby={hasError ? `${id}-error` : undefined}
                >
                    {children}
                </select>
                <motion.label
                    htmlFor={id}
                    className="absolute top-1/2 -translate-y-1/2 bg-white dark:bg-gray-700 px-1 text-base transition-all duration-300 ease-in-out pointer-events-none"
                    animate={{
                        top: isFocused || value ? "-0.65rem" : "50%",
                        left: isFocused || value ? "2.25rem" : "2.5rem",
                        fontSize: isFocused || value ? "0.875rem" : "1rem",
                        color: isFocused ? (hasError ? '#EF4444' : '#205295') : (hasError ? '#EF4444' : '#6B7280')
                    }}
                >
                    {label}
                </motion.label>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </motion.div>
            <AnimatePresence>
                {hasError && (
                    <motion.p
                        id={`${id}-error`}
                        className="mt-1 ml-2 text-xs font-semibold text-red-500"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};
// Reusable Motion Button
const MotionButton: React.FC<{ children: React.ReactNode, onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void, type?: "button" | "submit" | "reset", isLoading?: boolean, disabled?: boolean, className?: string }> = ({ children, onClick = () => { }, type = "button", isLoading = false, disabled = false, className = '' }) => (
    <motion.button
        type={type}
        onClick={onClick}
        disabled={isLoading || disabled}
        whileHover={!isLoading && !disabled ? { scale: 1.05 } : {}}
        whileTap={!isLoading && !disabled ? { scale: 0.95 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={`w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-full text-brand-dark-blue bg-brand-yellow hover:bg-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed ${className}`}
    >
        {isLoading ? <Spinner /> : children}
    </motion.button>
);

const ConfettiParticle: React.FC<{ i: number }> = ({ i }) => {
    const colors = ['#FFC107', '#205295', '#FF6B6B', '#4ECDC4', '#2C74B3'];
    const duration = 1.2 + Math.random() * 1;
    const delay = Math.random() * 0.5;
    const finalX = (Math.random() - 0.5) * 400;
    const finalY = (Math.random() - 0.5) * 600;
    const initialRotation = Math.random() * 360;
    const finalRotation = initialRotation + (Math.random() - 0.5) * 720;

    return (
        <motion.div
            className="absolute top-1/2 left-1/2"
            style={{
                backgroundColor: colors[i % colors.length],
                width: `${Math.random() * 6 + 4}px`,
                height: `${Math.random() * 10 + 6}px`,
            }}
            initial={{ opacity: 1, x: '-50%', y: '-50%', scale: 1, rotate: initialRotation }}
            animate={{
                opacity: 0,
                x: `calc(-50% + ${finalX}px)`,
                y: `calc(-50% + ${finalY}px)`,
                scale: 0.5,
                rotate: finalRotation,
            }}
            transition={{ duration, ease: "easeOut", delay }}
        />
    );
};

const AuthPage: React.FC = () => {
    const { user, adminUser, login, register, checkUserExists, resetPassword, adminLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const modeFromParams = searchParams.get('mode');
    const initialMode = modeFromParams === 'admin' ? 'admin' : 'login';

    const [mode, setMode] = React.useState<AuthMode>(initialMode);
    const [isLoading, setIsLoading] = React.useState(false);
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    // Form states
    const [loginForm, setLoginForm] = React.useState({ contact: '', password: '' });
    const [adminForm, setAdminForm] = React.useState({ contact: '', password: '' });
    const [registerForm, setRegisterForm] = React.useState({
        fullName: '',
        schoolName: '',
        contact: '',
        class: '',
        stream: '',
        otherStream: '',
        password: '',
        confirmPassword: '',
        photo: ''
    });
    const [resetContact, setResetContact] = React.useState('');
    const [resetPasswordForm, setResetPasswordForm] = React.useState({ password: '', confirmPassword: '' });

    // Step states
    const [registrationStep, setRegistrationStep] = React.useState<RegistrationStep>('details');
    const [resetStep, setResetStep] = React.useState<ResetStep>('contact');

    // UI states
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = React.useState(false);

    // Photo step states
    const [photoData, setPhotoData] = React.useState<string | null>(null);
    const [showCamera, setShowCamera] = React.useState(false);
    const [isFileUploading, setIsFileUploading] = React.useState(false);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const locationState = location.state as { fromEventId?: string; message?: string } | undefined;

    // Redirect already logged-in users or navigate after a successful login.
    React.useEffect(() => {
        if (adminUser) {
            navigate('/admin/dashboard', { replace: true });
        } else if (user) {
            if (locationState?.fromEventId) {
                navigate('/dashboard', { state: { highlightEventId: locationState.fromEventId }, replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        }
    }, [user, adminUser, navigate, locationState]);

    React.useEffect(() => {
        setErrors({}); // Clear errors when switching auth mode
    }, [mode, resetStep]);

    React.useEffect(() => {
        let stream: MediaStream | null = null;

        const startStream = async () => {
            if (showCamera && videoRef.current) {
                try {
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.camera;
                        return newErrors;
                    });

                    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err: any) {
                    console.error("Camera access denied:", err);
                    let message = "Could not access the camera. Please ensure it's not in use by another application.";
                    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                        message = "Camera access was denied. Please allow camera permissions in your browser settings to use this feature.";
                    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                        message = "No camera was found on your device. You can upload a photo instead.";
                    }
                    setErrors({ camera: message });
                    setShowCamera(false);
                }
            }
        };

        startStream();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };
    }, [showCamera]);


    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (mode === 'login') {
            if (!loginForm.contact) newErrors.contact = "Contact number is required.";
            else if (!/^\d{10}$/.test(loginForm.contact)) newErrors.contact = "Please enter a valid 10-digit number.";
            if (!loginForm.password) newErrors.password = "Password is required.";
        }
        if (mode === 'admin') {
            if (!adminForm.contact) newErrors.contact = "Contact number is required.";
            if (!adminForm.password) newErrors.password = "Password is required.";
        }
        if (mode === 'register' && registrationStep === 'details') {
            if (!registerForm.fullName.trim()) newErrors.fullName = "Full name is required.";
            if (!registerForm.schoolName.trim()) newErrors.schoolName = "School name is required.";
            if (!registerForm.contact) newErrors.contact = "Contact number is required.";
            else if (!/^\d{10}$/.test(registerForm.contact)) newErrors.contact = "Please enter a valid 10-digit number.";
            else if (checkUserExists(registerForm.contact)) newErrors.contact = "An account with this contact number already exists.";
            if (!registerForm.class.trim()) newErrors.class = "Class is required.";
            if (!registerForm.stream.trim()) newErrors.stream = "Stream is required.";
            if (registerForm.stream === 'Other' && !registerForm.otherStream.trim()) newErrors.otherStream = "Please specify your stream.";
            if (!registerForm.password || registerForm.password.length < 6) newErrors.password = "Password must be at least 6 characters long.";
            if (registerForm.password !== registerForm.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        formSetter: React.Dispatch<React.SetStateAction<any>>
    ) => {
        const { name, value } = e.target;
        formSetter(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                if (name === 'password' && prev.confirmPassword) {
                    delete newErrors.confirmPassword;
                }
                if (name === 'stream' && prev.otherStream) {
                    delete newErrors.otherStream;
                }
                return newErrors;
            });
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setIsLoading(true);
        setErrors({});
        try {
            login(loginForm.contact, loginForm.password);
        } catch (err: any) {
            setErrors({ form: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setIsLoading(true);
        try {
            adminLogin(adminForm.contact, adminForm.password);
        } catch (err: any) {
            setErrors({ form: err.message });
            setIsLoading(false);
        }
    };

    const handleRegisterDetails = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if user exists immediately
        if (checkUserExists(registerForm.contact)) {
            setErrors({ contact: "Account already exists! Redirecting to login..." });

            // Smart Redirect Logic
            setTimeout(() => {
                setLoginForm(prev => ({ ...prev, contact: registerForm.contact }));
                setMode('login');
                setErrors({}); // Clear errors after redirect
            }, 1500);
            return;
        }

        if (!validate()) return;
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setRegistrationStep('photo');
        }, 1000);
    };

    const handleRegisterSubmit = () => {
        setIsLoading(true);
        try {
            const { confirmPassword, otherStream, ...userDetails } = registerForm;
            if (userDetails.stream === 'Other') {
                userDetails.stream = otherStream;
            }
            userDetails.photo = photoData || '';
            register(userDetails);
        } catch (err: any) {
            setErrors({ form: err.message });
            setIsLoading(false);
        }
    };

    const handleResetContact = (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetContact) {
            setErrors({ resetContact: "Contact number is required." });
            return;
        }
        if (!checkUserExists(resetContact)) {
            setErrors({ resetContact: "No account found with this contact number." });
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setResetStep('password');
        }, 1000);
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (resetPasswordForm.password.length < 6) {
            setErrors({ password: "Password must be at least 6 characters long." });
            return;
        }
        if (resetPasswordForm.password !== resetPasswordForm.confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match." });
            return;
        }
        setIsLoading(true);
        try {
            resetPassword(resetContact, resetPasswordForm.password);
            setMode('login');
        } catch (err: any) {
            setErrors({ form: err.message });
        } finally {
            setIsLoading(false);
        }
    };
    const handleTakePhoto = () => {
        setPhotoData(null);
        setShowCamera(true);
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
                const dataUrl = canvasRef.current.toDataURL('image/jpeg');
                setPhotoData(dataUrl);
                setShowCamera(false);
            }
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsFileUploading(true);
            const reader = new FileReader();
            reader.onload = (event) => {
                setPhotoData(event.target?.result as string);
                setIsFileUploading(false);
            };
            reader.onerror = () => {
                setIsFileUploading(false);
                setErrors({ camera: "Failed to read the selected file." });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResetPhoto = () => {
        setPhotoData(null);
        setShowCamera(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };


    const renderContent = () => {
        switch (mode) {
            case 'register':
                return (
                    <motion.div key="register" variants={pageTransition} initial="hidden" animate="visible" exit="exit">
                        <AnimatePresence mode="wait">
                            {registrationStep === 'details' && (
                                <motion.div key="details-wrapper">
                                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-brand-dark-blue dark:text-gray-100 mb-2">Create Account</h2>
                                    <p className="text-center text-brand-blue dark:text-gray-400 mb-6">Join the Youthopia community!</p>
                                    <motion.form key="details" variants={stepVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleRegisterDetails} className="space-y-3" noValidate>
                                        <InputField id="fullName" name="fullName" label="Full Name" icon={<FiUser />} value={registerForm.fullName} onChange={e => handleInputChange(e, setRegisterForm)} error={errors.fullName} />
                                        <InputField id="schoolName" name="schoolName" label="College/School Name" icon={<FaSchool />} value={registerForm.schoolName} onChange={e => handleInputChange(e, setRegisterForm)} error={errors.schoolName} />
                                        <InputField id="contactReg" name="contact" label="Contact Number" icon={<FiPhone />} value={registerForm.contact} onChange={e => handleInputChange(e, setRegisterForm)} error={errors.contact} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField id="class" name="class" label="Class" icon={<FaGraduationCap />} value={registerForm.class} onChange={e => handleInputChange(e, setRegisterForm)} error={errors.class} />
                                            <SelectField id="stream" name="stream" label="Stream" icon={<FaStream />} value={registerForm.stream} onChange={e => handleInputChange(e, setRegisterForm)} error={errors.stream}>
                                                <option value="" disabled>Select Stream</option>
                                                <option value="Science">Science</option>
                                                <option value="Commerce">Commerce</option>
                                                <option value="Humanities (Arts)">Humanities (Arts)</option>
                                                <option value="Other">Other</option>
                                            </SelectField>
                                        </div>
                                        <AnimatePresence>
                                            {registerForm.stream === 'Other' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    animate={{ opacity: 1, height: 'auto', marginTop: '0.75rem' }}
                                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <InputField id="otherStream" name="otherStream" label="Please specify stream" icon={<FaStream />} value={registerForm.otherStream} onChange={e => handleInputChange(e, setRegisterForm)} error={errors.otherStream} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        <InputField id="passwordReg" name="password" label="Password" icon={<FiLock />} value={registerForm.password} onChange={e => handleInputChange(e, setRegisterForm)} isPassword isVisible={isPasswordVisible} onVisibilityChange={() => setIsPasswordVisible(!isPasswordVisible)} error={errors.password} />
                                        <InputField id="confirmPasswordReg" name="confirmPassword" label="Confirm Password" icon={<FiLock />} value={registerForm.confirmPassword} onChange={e => handleInputChange(e, setRegisterForm)} isPassword isVisible={isConfirmPasswordVisible} onVisibilityChange={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} error={errors.confirmPassword} />
                                        <div className="pt-2"><MotionButton type="submit" isLoading={isLoading}>Next</MotionButton></div>
                                    </motion.form>
                                </motion.div>
                            )}
                            {registrationStep === 'photo' && (
                                <motion.div key="photo" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="text-center">
                                    <h3 className="font-semibold text-brand-dark-blue dark:text-gray-200 mb-2">Add a Profile Photo</h3>
                                    <p className="text-brand-blue dark:text-gray-400 mb-4">This will be your identity in Youthopia.</p>

                                    <div className="w-40 h-40 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full mb-4 flex items-center justify-center overflow-hidden relative">
                                        {photoData && <img src={photoData} alt="Profile preview" className="w-full h-full object-cover" />}
                                        {!photoData && !isFileUploading && <span className="w-8 h-8 mb-1 inline-flex items-center justify-center"><FiUser size={60} /></span>}
                                        {isFileUploading && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <Spinner className="h-10 w-10 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {showCamera && (
                                        <div className="mb-4 space-y-3">
                                            <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-lg shadow-inner" />
                                            <MotionButton onClick={handleCapture}>Capture Photo</MotionButton>
                                            <button onClick={() => setShowCamera(false)} className="text-sm font-semibold text-brand-blue dark:text-gray-400 hover:underline">
                                                Cancel Camera
                                            </button>
                                        </div>
                                    )}

                                    {!photoData && !showCamera && !isFileUploading && (
                                        <div className="space-y-3">
                                            <input type="file" accept="image/*" capture="user" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                                            <MotionButton onClick={handleTakePhoto}><span className="mr-2"></span><FiCamera /> Take Photo</MotionButton>
                                            <MotionButton onClick={() => fileInputRef.current?.click()}><span className="mr-2"></span><FiUpload /> Upload Picture</MotionButton>
                                            <button
                                                onClick={() => {
                                                    setPhotoData('https://i.pravatar.cc/150?u=skip');
                                                    setRegistrationStep('visaGrab');
                                                }}
                                                className="w-full py-3 text-brand-blue dark:text-gray-400 font-semibold hover:underline"
                                            >
                                                Skip for now
                                            </button>
                                        </div>
                                    )}

                                    {photoData && !showCamera && (
                                        <div className="space-y-3">
                                            <MotionButton onClick={() => setRegistrationStep('visaGrab')} isLoading={isLoading} disabled={!photoData}>
                                                Confirm and Continue
                                            </MotionButton>
                                            <button onClick={handleResetPhoto} className="flex items-center justify-center w-full text-sm font-semibold text-brand-blue dark:text-gray-400 hover:underline">
                                                <span className="mr-1"></span><FiRepeat /> Change Photo
                                            </button>
                                        </div>
                                    )}
                                    <canvas ref={canvasRef} className="hidden"></canvas>
                                </motion.div>
                            )}
                            {registrationStep === 'visaGrab' && (
                                <motion.div
                                    key="visaGrab"
                                    variants={stepVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="text-center relative overflow-hidden py-8"
                                >
                                    {Array.from({ length: 50 }).map((_, i) => (
                                        <ConfettiParticle key={i} i={i} />
                                    ))}
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1, transition: { type: 'spring', delay: 0.2 } }}
                                        className="flex flex-col items-center justify-center"
                                    >
                                        <span className="mb-4"><FiCheckCircle size={60} /></span>
                                        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark-blue dark:text-gray-100">Congratulations!</h2>
                                        <p className="text-base sm:text-lg text-brand-blue dark:text-gray-300 mt-2 max-w-xs">
                                            {registerForm.fullName.split(' ')[0]}, welcome to Youthopia...
                                            Your journey to mental wellbeing starts now.
                                        </p>
                                        <motion.div
                                            className="mt-4 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 font-bold py-2 px-4 rounded-full inline-block"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1, transition: { type: 'spring', delay: 0.5 } }}
                                        >
                                            +5 Welcome Points Awarded!
                                        </motion.div>
                                        <div className="mt-6 w-full max-w-xs">
                                            <MotionButton onClick={handleRegisterSubmit} isLoading={isLoading}>
                                                Grab Your VISA
                                            </MotionButton>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <p className="text-center mt-6 text-sm dark:text-gray-300">
                            Already have an account?{' '}
                            <button onClick={() => setMode('login')} className="font-semibold text-brand-blue dark:text-brand-light-blue hover:underline">
                                Sign In
                            </button>
                        </p>
                    </motion.div>
                );
            case 'forgotPassword':
                return (
                    <motion.div key="forgot" variants={pageTransition} initial="hidden" animate="visible" exit="exit">
                        <AnimatePresence mode="wait">
                            {resetStep === 'contact' && (
                                <motion.div key="reset-contact" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-brand-dark-blue dark:text-gray-100 mb-2">Reset Password</h2>
                                    <p className="text-center text-brand-blue dark:text-gray-400 mb-6">Enter your contact number to continue.</p>
                                    <form onSubmit={handleResetContact} className="space-y-4" noValidate>
                                        <InputField
                                            id="resetContact"
                                            name="resetContact"
                                            label="Contact Number"
                                            icon={<FiPhone />}
                                            value={resetContact}
                                            onChange={e => {
                                                setResetContact(e.target.value);
                                                if (errors.resetContact) setErrors(prev => ({ ...prev, resetContact: undefined }));
                                            }}
                                            error={errors.resetContact}
                                        />
                                        <div className="pt-2"><MotionButton type="submit" isLoading={isLoading}>Continue</MotionButton></div>
                                    </form>
                                </motion.div>
                            )}
                            {/* Removed intermediate reset step */}
                            {resetStep === 'password' && (
                                <motion.div key="reset-password" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-brand-dark-blue dark:text-gray-100 mb-2">Set New Password</h2>
                                    <p className="text-center text-brand-blue dark:text-gray-400 mb-6">Enter your new password below.</p>
                                    <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
                                        <InputField
                                            id="resetPassword"
                                            name="password"
                                            label="New Password"
                                            icon={<FiLock />}
                                            value={resetPasswordForm.password}
                                            onChange={e => handleInputChange(e, setResetPasswordForm)}
                                            isPassword
                                            isVisible={isPasswordVisible}
                                            onVisibilityChange={() => setIsPasswordVisible(!isPasswordVisible)}
                                            error={errors.password}
                                        />
                                        <InputField
                                            id="resetConfirmPassword"
                                            name="confirmPassword"
                                            label="Confirm New Password"
                                            icon={<FiLock />}
                                            value={resetPasswordForm.confirmPassword}
                                            onChange={e => handleInputChange(e, setResetPasswordForm)}
                                            isPassword
                                            isVisible={isConfirmPasswordVisible}
                                            onVisibilityChange={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                                            error={errors.confirmPassword}
                                        />
                                        <div className="pt-2"><MotionButton type="submit" isLoading={isLoading}>Reset Password</MotionButton></div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <p className="text-center mt-6 text-sm dark:text-gray-300">
                            Remember your password?{' '}
                            <button onClick={() => setMode('login')} className="font-semibold text-brand-blue dark:text-brand-light-blue hover:underline">
                                Sign In
                            </button>
                        </p>
                    </motion.div>
                );
            case 'admin':
                return (
                    <motion.div key="admin" variants={pageTransition} initial="hidden" animate="visible" exit="exit">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center text-brand-dark-blue dark:text-gray-100 mb-2">Admin Access</h2>
                        <p className="text-center text-brand-blue dark:text-gray-400 mb-6">Enter your credentials to manage Youthopia.</p>
                        <form onSubmit={handleAdminLogin} className="space-y-4" noValidate>
                            <InputField id="contactAdmin" name="contact" label="Contact Number" icon={<FiPhone />} value={adminForm.contact} onChange={e => handleInputChange(e, setAdminForm)} error={errors.contact} />
                            <InputField id="passwordAdmin" name="password" label="Password" icon={<FiLock />} value={adminForm.password} onChange={e => handleInputChange(e, setAdminForm)} isPassword isVisible={isPasswordVisible} onVisibilityChange={() => setIsPasswordVisible(!isPasswordVisible)} error={errors.password} />
                            <div className="pt-2">
                                <MotionButton type="submit" isLoading={isLoading} className="bg-brand-blue text-white hover:bg-brand-dark-blue">
                                    <span className="mr-2"><FiShield /></span> Admin Sign In
                                </MotionButton>
                            </div>
                        </form>
                        <p className="text-center mt-6 text-sm dark:text-gray-300">
                            Not an admin?{' '}
                            <button onClick={() => setMode('login')} className="font-semibold text-brand-blue dark:text-brand-light-blue hover:underline">
                                Student Login
                            </button>
                        </p>
                    </motion.div>
                );
            default:
                return (
                    <motion.div key="login" variants={pageTransition} initial="hidden" animate="visible" exit="exit">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center text-brand-dark-blue dark:text-gray-100 mb-2">Get started instantly!</h2>
                        <p className="text-center text-brand-blue dark:text-gray-400 mb-6">Sign in with your phone number and password.</p>
                        <form onSubmit={handleLogin} className="space-y-4" noValidate>
                            <InputField id="contactLogin" name="contact" label="Contact Number" icon={<FiPhone />} value={loginForm.contact} onChange={e => handleInputChange(e, setLoginForm)} error={errors.contact} />
                            <InputField id="passwordLogin" name="password" label="Password" icon={<FiLock />} value={loginForm.password} onChange={e => handleInputChange(e, setLoginForm)} isPassword isVisible={isPasswordVisible} onVisibilityChange={() => setIsPasswordVisible(!isPasswordVisible)} error={errors.password} />
                            <div className="pt-2"><MotionButton type="submit" isLoading={isLoading}>Sign In</MotionButton></div>
                        </form>
                        <p className="text-center mt-6 text-sm dark:text-gray-300">
                            Don't have an account?{' '}
                            <button onClick={() => { setMode('register'); setRegistrationStep('details'); }} className="font-semibold text-brand-blue dark:text-brand-light-blue hover:underline">
                                Sign Up
                            </button>
                        </p>
                        <p className="text-center mt-4 text-xs text-gray-400 dark:text-gray-500">
                            Are you an admin?{' '}
                            <button onClick={() => setMode('admin')} className="font-semibold text-gray-500 dark:text-gray-400 hover:underline">
                                Login Here
                            </button>
                        </p>
                    </motion.div>
                );
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageTransition}
            className="container mx-auto px-4 py-8 md:py-12 min-h-[calc(100vh-80px)]"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="hidden lg:flex justify-center">
                    <div className="w-full max-w-lg">
                        <Illustration />
                    </div>
                </div>
                <div className="w-full max-w-md mx-auto">
                    <motion.div
                        className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl"
                        variants={itemSpringUp}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence>
                            {locationState?.message && (
                                <motion.div
                                    className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-lg flex items-start gap-3"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <span className="mt-1 flex-shrink-0"><FiInfo /></span>
                                    <p className="text-sm font-semibold">{locationState.message}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {renderContent()}
                        </AnimatePresence>
                        <AnimatePresence>
                            {(errors.form || errors.camera) && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="mt-4 text-center text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 p-2 rounded-md text-sm font-semibold"
                                >
                                    {errors.form || errors.camera}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default AuthPage;
