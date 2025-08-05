import { LearningAppFascade } from "../model/LearningAppFascade";

function Home() {
    const learningAppFascade = LearningAppFascade.getInstance();
    return (
    <h1>{learningAppFascade.viewAccountDetails()}</h1>
    )
}

export default Home;