
const SignOut = ({ signout }) => (
  <div>
    <div className="push-double">
      <h4 className="text-center">
        Sign out of your NewSpring profile
      </h4>
    </div>
    <div className="one-whole text-center">
      <button className="btn" onClick={signout}>
        Sign Out
      </button>
    </div>
  </div>
)

export default SignOut
