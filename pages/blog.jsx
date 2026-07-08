import React from 'react';
import SEO from '../src/common/seo';
import Blog from '../src/components/blog';
import Wrapper from '../src/layout/wrapper';

const index = () => {
    return (
        <Wrapper>
            <SEO pageTitle={"Softec - Data analytics"} /> 
            <Blog />           
        </Wrapper>
    );
};

export default index;
