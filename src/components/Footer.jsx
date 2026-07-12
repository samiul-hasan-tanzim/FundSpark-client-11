"use client";
import Link from "next/link";
import { Globe, Mail } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-slate-100 w-full pt-16 pb-6 border-t border-slate-300">
            <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-4 gap-10">
                <div className="space-y-6">
                    <Link className="text-xl font-bold text-slate-900" href="/">FundSpark</Link>
                    <p className="text-sm text-slate-500 leading-relaxed">The premier destination for innovative minds and visionary backers to build the future together.</p>
                    <div className="flex gap-6">
                        <a className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-700 transition-colors" href="#">
                            <Globe size={20} />
                        </a>
                        <a className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-700 transition-colors" href="#">
                            <Mail size={20} />
                        </a>
                    </div>
                </div>
                <div className="space-y-3">
                    <h5 className="font-semibold text-sm text-slate-900 uppercase tracking-widest">Platform</h5>
                    <ul className="space-y-1">
                        <li><a className="text-sm text-slate-500 hover:text-indigo-700 transition-colors" href="#">About Us</a></li>
                        <li><a className="text-sm text-slate-500 hover:text-indigo-700 transition-colors" href="#">How it Works</a></li>
                        <li><a className="text-sm text-slate-500 hover:text-indigo-700 transition-colors" href="#">Trust & Safety</a></li>
                        <li><a className="text-sm text-slate-500 hover:text-indigo-700 transition-colors" href="#">Pricing</a></li>
                    </ul>
                </div>
                <div className="space-y-3">
                    <h5 className="font-semibold text-sm text-slate-900 uppercase tracking-widest">Resources</h5>
                    <ul className="space-y-1">
                        <li><a className="text-sm text-slate-500 hover:text-indigo-700 transition-colors" href="#">Help Center</a></li>
                        <li><a className="text-sm text-slate-500 hover:text-indigo-700 transition-colors" href="#">Success Stories</a></li>
                        <li><a className="text-sm text-slate-500 hover:text-indigo-700 transition-colors" href="#">Creator Handbook</a></li>
                        <li><a className="text-sm text-slate-500 hover:text-indigo-700 transition-colors" href="#">Community</a></li>
                    </ul>
                </div>
                <div className="space-y-3">
                    <h5 className="font-semibold text-sm text-slate-900 uppercase tracking-widest">Legal</h5>
                    <ul className="space-y-1">
                        <li><a className="text-sm text-slate-500 hover:text-indigo-700 transition-colors" href="#">Privacy Policy</a></li>
                        <li><a className="text-sm text-slate-500 hover:text-indigo-700 transition-colors" href="#">Terms of Service</a></li>
                        <li><a className="text-sm text-slate-500 hover:text-indigo-700 transition-colors" href="#">Cookie Policy</a></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-5 mt-16 pt-8 border-t border-slate-300/30 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} FundSpark Inc. All rights reserved.</p>
                <div className="flex gap-6">
                    <img className="h-6 opacity-40 grayscale" alt="Payment providers" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLNZAZBd7XnlaA9bQekKdyntT5DC3f_S3_-eBP2s7rj8mqi-O31Qc7dShEKbdcAL5mn2Qch_skZyxF_4fAomJ2v61Hp2uOsE12kad6fUP_rjBL6ebNX5fwnJED3JVkP0k5tGnqbNwIs3zTJH-owIsuWiY18ezBLdZly41CdQet7xj_adQW4K21c_HVU3sRpgOKaaAA0gu0DGTdXS0BrNwnLmDHfmT7L5r4TyJc1rVjTLEsAprGxiur6hHIHorp0vtU4NR7bs8MgjMa" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
