import { LearningAppFascade } from "../model/LearningAppFascade";

function Video() {
  const learningAppFascade = LearningAppFascade.getInstance();

  return (
    <div>
      <h2>Watch this video:</h2>
      <video width="640" height="360" controls>
        <source src={learningAppFascade.getCurrentLesson().getVidFileName()} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default Video;