
const LevelBadge = ({level}: {level: 'Beginner' | 'Intermediate' | 'Advance'}) => {
    
    if(level === 'Beginner'){
        return (
            <div className={`border-2 border-green-700 bg-green-200 text-green-500 rounded-sm px-4 py1`}>
                {level}
            </div>
        )
    } else if (level === 'Intermediate') {
        return (
            <div className={`border-2 border-yellow-700 bg-yellow-200 text-yellow-500 rounded-sm px-4 py1`}>
                {level}
            </div>
        )
    } else {
        return (
            <div className={`border-2 border-red-700 bg-red-200 text-red-500 rounded-sm px-4 py1`}>
                {level}
            </div>
        )
    }
};

export default LevelBadge;
