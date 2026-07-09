import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// የፕሮጀክቱን ፅንሰ-ሀሳብ የሚገልጹ ምስሎች ስሞች (Paths can remain or be updated in public folder)
import shapes_2 from "../../../../public/assets/img/payment/mobile.png"; // ለዲጂታል መድረክ
import shapes_3 from "../../../../public/assets/img/payment/hand.png"; // ለስልጣን/ዲፕሎማሲ
import shapes_4 from "../../../../public/assets/img/payment/coin-1.png"; // ለኢኮኖሚ/ክለቦች
import shapes_5 from "../../../../public/assets/img/payment/coin-2.png"; 
import shapes_6 from "../../../../public/assets/img/payment/payment-3.png"; // ለህግ ሰነዶች
import payment_img_1 from "../../../../public/assets/img/payment/image.png"; // ለዋናው ጥናታዊ ግራፊክስ

const insights_content = {
    title: <>ከሜዳው ባሻገር ያለውን እውነታ <br /> በጥልቀት ይመርምሩ።</>,
    sub_title: <>በእግር ኳስ፣ ህግ እና ፖለቲካ ዙሪያ የተሰናዱ ሁለንተናዊ ትንተናዎች</>,
    box_1: [
        {
            id: 1, 
            col: "md-6",
            cls: "2 tpfadeLeft",
            delay: ".3s",
        title: "መንግስታት እና ፖለቲካ ",
            box_3_btn: "የምርምር ማዕከሉን ይጎብኙ",
            des: <>መንግስታት እና የፖለቲካ መሪዎች እግር ኳስን ለስላሳ ስልጣን (Soft Power) እና ለዲፕሎማሲያዊ ተፅእኖ እንዴት እንደሚጠቀሙበት እንመረምራለን።</>,
            shapes: [
                { id: 1, cls: "5", img: shapes_2 },
                { id: 2, cls: "6", img: shapes_3 },
                { id: 3, cls: "7", img: shapes_4 },
                { id: 4, cls: "8", img: shapes_5 },
            ]
        },
        {
            id: 2, 
            col: "md-6",
            cls: "3 tpfadeRight",
            delay: ".5s",
            title: "የእግር ኳስ ህግ እና አስተዳደር",
          des: <>ትክክለኛው የእግር ኳስ ህግ ምንድነው? የጨዋታውን የወደፊት ዕጣ ፈንታ የሚቀርጹ ቀጣዮቹን ትላልቅ የህግ ጉዳዮች እና የዝውውር ደንቦች እንፈትሻለን።</>,
            box_3_btn: "የምርምር ማዕከሉን ይጎብኙ",
            shapes: [
                { id: 1, cls: "9", img: shapes_6 },
            ]
        },
    ],
    box_3_title: <>የማህበረሰብ ክለቦች እና <br /> ማህበራዊ-ፖለቲካዊ ተፅእኖ።</>,
    box_3_des: <>በታችኛው ደረጃ ያሉ ክለቦች የአካባቢውን ፖለቲካ፣ ዘረኝነትን፣ እና በአጠቃላይ በስፖርቱ ውስጥ ያለውን የአእምሮ ጤና ተግዳሮት እንዴት እንደሚያንፀባርቁ የሚያሳይ ጥናት።</>,
    box_3_btn: "የምርምር ማዕከሉን ይጎብኙ",
}

const { title, sub_title, box_1, box_3_title, box_3_des, box_3_btn } = insights_content;

const InsightsArea = () => {
    return (
        <>
        <div id="insights-section" className="tp-payment__area pt-110 pb-110">
               <div className="container">
                  <div className="row justify-content-center">
                     <div className="col-xl-7">
                        <div className="tp-payment__title-box text-center mb-55">
                           <h3 className="tp-section-title-lg">{title}</h3>
                           <p>{sub_title}</p>
                        </div>
                     </div>
                  </div>
                  <div className="row justify-content-center">

                     <div className="col-xl-12">
                        <div className="row">
                             {box_1.map((item, i) => 
                                 <div key={i} className="col-md-6 mb-30">
                              <div className={`tp-payment__item tp-payment__bg-color-${item.cls} p-relative z-index wow `} 
                                    data-wow-duration=".9s" 
                                    data-wow-delay={item.delay}>
                                 {item.shapes.map((shape, index) => 
                                    <div key={index} className={`tp-payment__shape-${shape.cls}`}>
                                        <Image src={shape.img} alt="research-shapes" />
                                    </div>
                                 )}

                                <div className="tp-payment__content">
                                    <h3 className="tp-payment__title">{item.title}</h3>
                                    <p> {item.des}</p>
                                 </div> 
                                  
                              </div>
                           </div>
                                 )
                             }
                        </div>
                     </div>

                     <div className="col-xl-12 mb-30">
                        <div className="tp-payment__item p-relative z-index wow tpfadeUp" data-wow-duration=".9s" data-wow-delay=".7s">
                           <div className="row">
                              <div className="col-md-6">
                                 <div className="tp-payment__content tp-payment__content-space">
                                    <h3 className="tp-payment__title">{box_3_title}</h3>
                                    <p>{box_3_des}</p>
                                    <Link href="/research" className="tp-btn-link">{box_3_btn}<i className="far fa-arrow-right"></i></Link>
                                 </div>
                              </div>
                              <div className="col-md-6">
                                 <div className="tp-payment__shape-2">
                                    <Image src={payment_img_1} alt="socio-political-analysis" />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                  </div>
               </div>
            </div>
            
        </>
    );
};

export default InsightsArea;