import React from "react";

const Heading = ({children}: {children: React.ReactNode}) => { // dùng children nghĩa là có thể truyền bất cứ nội dung gì vào trong thẻ Heading
    return (                                                   // children có thể là text, html, component react
        <h1 className="text-3xl font-bold">{children}</h1>     // React.ReactNode là kiểu dữ liệu bao gồm tất cả các kiểu dữ liệu có thể được render trong React
    )
}

export default Heading;