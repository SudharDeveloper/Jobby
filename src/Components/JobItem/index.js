import './index.css'
import {Link} from 'react-router-dom'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

const JobItem = props => {
  const {jobDetails} = props

  const {
    id,
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`} className="job-link">
      <li className="job-card">
        <div className="top-section">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />

          <div className="title-container">
            <h3 className="job-title">{title}</h3>

            <div className="rating-container">
              <FaStar className="star-icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>

        <div className="middle-section">
          <div className="location-employment">
            <div className="icon-text">
              <MdLocationOn className="icon" />
              <p>{location}</p>
            </div>

            <div className="icon-text">
              <BsBriefcaseFill className="icon" />
              <p>{employmentType}</p>
            </div>
          </div>

          <p className="package">{packagePerAnnum}</p>
        </div>

        <hr className="line" />

        <div className="description-section">
          <h4>Description</h4>
          <p className="description">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobItem
