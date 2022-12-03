module.exports = ({ req }) => {
  return `
    Your ID is: <strong>${req.session.userId}</strong>
              <div>
                  <form method="POST">
                      <input name="email" placeholder="email">
                      <input name="password" placeholder="password">
                      <input name="passwordConfirmation" placeholder="password confirmation">
                      <button>Sign up</button>
                  </form>
              </div>
    `;
};
