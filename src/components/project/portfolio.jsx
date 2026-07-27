import portfolio_data from '@/src/data/portfolio-data';
import React, { useEffect, useMemo, useState } from 'react';

const Portfolio = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('/api/multimedia/public')
            .then((response) => response.json())
            .then((data) => setItems(data.multimedia || []));
    }, []);

    const categories = useMemo(() => [
        "All",
        ...new Set(items.map((item) => item.chapter).filter(Boolean)),
    ], [items]);

    const filteredItems = activeCategory === "All"
        ? items
        : items.filter((item) => item.chapter === activeCategory);

    const filterItems = (category) => {
        setActiveCategory(category);
    };


    return (
        <>
            <div className="portfolio-area pt-100 pb-90">
               <div className="container">
                  <div className="row">
                     <div className="col-xl-12">
                        <div className="portfolio-filter masonary-menu text-center mb-35">
                            {categories.map((cate, i) => (
                                <button
                                onClick={() => filterItems(cate)}
                                key={i}
                                className={`${cate === activeCategory ? "active" : ""}`}
                                >
                                <span>{cate}</span>
                                </button>
                            ))}    
                        </div>
                     </div>
                  </div>
                  <div className="row grid">
                    {filteredItems.map((item) =>
                        <div key={item.id} className="col-xl-4 col-lg-6 col-md-6 col-sm-6 grid-item cat1 cat4 cat3 cat5">
                            <div className="inner-project-item mb-30">
                            <div className="inner-project-img fix p-relative">
                                <img className="w-100" src={item.thumbnailUrl || item.fileUrl} alt={item.titleEn} />
                            </div>
                            <div className="inner-project-content">
                                <span className="inner-project-category-title">{item.chapter || 'Multimedia'}</span>
                                <h4 className="inner-project-title"><a href={item.fileUrl} target="_blank" rel="noreferrer">{item.titleEn}</a></h4>
                                <p>{item.descriptionEn}</p>
                            </div>
                            </div>
                        </div>
                    )}
                  </div>
               </div>
            </div>
        </>
    );
};

export default Portfolio;
