import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, ArrowLeft, Users, Shield, Target, Award } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

export default function About() {
    useEffect(() => { document.title = "About Us | EduAlert Announcement System"; }, []);

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
                    <Logo showText={true} className="scale-90 origin-left" />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>

                <section className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            Our Vision
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
                            Revolutionizing Campus <br />
                            <span className="text-primary">Communication</span>
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            EduAlert is more than just an announcement system – it's a bridge between the administration and students. Our platform ensures that critical information reaches the right audience at the right time, fostering a transparent and connected academic environment.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-primary">50k+</span>
                                <span className="text-xs text-muted-foreground font-bold uppercase">Users</span>
                            </div>
                            <div className="w-px h-10 bg-border mx-2" />
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-primary">100+</span>
                                <span className="text-xs text-muted-foreground font-bold uppercase">Institutions</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 aspect-video lg:aspect-square"
                    >
                        <img
                            src="/modern_college_campus_1772365333381.png"
                            alt="Modern College Campus"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                            <p className="text-white font-medium italic">Empowering the next generation of academic leaders.</p>
                        </div>
                    </motion.div>
                </section>

                <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {[
                        { icon: Users, title: "Student Centric", desc: "Designed with the student experience at the core of every feature." },
                        { icon: Shield, title: "Secure Data", desc: "Enterprise-grade security rituals to protect institutional data." },
                        { icon: Target, title: "Precision Reach", desc: "Smart filtering ensures relevant updates reach the targeted audience." },
                        { icon: Award, title: "Excellence", desc: "Committed to delivering high-performance communication solutions." },
                    ].map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="p-8 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all group"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <item.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </section>

                <section className="rounded-[3rem] bg-primary p-8 sm:p-16 text-center text-primary-foreground relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-[100px]" />
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-black blur-[100px]" />
                    </div>
                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <h2 className="text-3xl sm:text-5xl font-black">Ready to scale your campus community?</h2>
                        <p className="text-primary-foreground/80 text-lg">Join hundreds of institutions already using EduAlert.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link to="/user/register" className="px-10 py-4 bg-white text-primary font-bold rounded-2xl hover:bg-opacity-90 transition-all shadow-xl shadow-black/10">
                                Register Today
                            </Link>
                            <Link to="/contact" className="px-10 py-4 bg-primary-foreground/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-2xl hover:bg-primary-foreground/20 transition-all">
                                Learn More
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-12 border-t border-border mt-20 text-center">
                <p className="text-sm text-muted-foreground">© 2026 EduAlert Announcement System. All rights reserved.</p>
            </footer>
        </div>
    );
}
