"use client";
import { Poppins, Inter } from "next/font/google";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { testimonials } from "@/lib/homeData";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function Testimonials() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-5">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl md:text-4xl font-bold text-slate-900 ${poppins.className}`}>What Our Users Say</h2>
                    <p className={`mt-3 text-slate-500 max-w-lg mx-auto ${inter.className}`}>Hear from the FundSpark community</p>
                </div>
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    loop
                    breakpoints={{ 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
                    spaceBetween={24}
                    className="pb-4"
                >
                    {testimonials.map((t, i) => (
                        <SwiperSlide key={i}>
                            <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-8 h-full hover:shadow-lg transition-shadow duration-300">
                                <div className="flex items-center gap-1 mb-4">
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <svg key={j} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className={`text-sm text-slate-600 leading-relaxed mb-6 ${inter.className}`}>&ldquo;{t.text}&rdquo;</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white text-sm font-medium">
                                        {t.name.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-semibold text-slate-900 ${inter.className}`}>{t.name}</p>
                                        <p className={`text-xs text-slate-500 ${inter.className}`}>{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
