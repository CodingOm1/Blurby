const AlertBubble = (message, alertType, status) => {
    if (alertType === 'good') {
        return <div className="w-full h-screen fixed top-0 left-0 pointer-events-none ">
                <div className="px-5 py-5 bg-purple-800 "></div>
        </div>
    }
}

export default AlertBubble;