import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props

  const {
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    jobDescription,
  } = jobDetails

  return (
    <li className="similar-job-card">
      <div className="similar-top-section">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="similar-company-logo"
        />

        <div className="similar-title-container">
          <h3 className="similar-job-title">{title}</h3>

          <div className="similar-rating-container">
            <FaStar className="star-icon" />
            <p>{rating}</p>
          </div>
        </div>
      </div>

      <h4>Description</h4>

      <p className="similar-description">{jobDescription}</p>

      <div className="similar-bottom-section">
        <div className="icon-text">
          <MdLocationOn className="icon" />
          <p>{location}</p>
        </div>

        <div className="icon-text">
          <BsBriefcaseFill className="icon" />
          <p>{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobItem
