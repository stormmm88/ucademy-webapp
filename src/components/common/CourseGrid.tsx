import React from 'react'

const CourseGrid = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 mt-6 gap-4 lg:gap-8 course-slider">{children}</div>
    )
}

export default CourseGrid;