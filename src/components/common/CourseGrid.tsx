import React from 'react'

const CourseGrid = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="grid grid-cols-3 mt-8 gap-8">{children}</div>
    )
}

export default CourseGrid;