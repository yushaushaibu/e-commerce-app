const layout = require("../layout");

const getError = (errors, prop) => {
  // prop === 'email' || 'password' || passwordConfirmation
  try {
    return errors.mapped()[prop].msg;
  } catch(err) {
    return '';
  }
}

module.exports = ({ req, errors }) => {
  return layout({
    content: `
        Your ID is: <strong>${req.session.userId}</strong>
                    <div>
                        <form method="POST">
                            <input name="email" placeholder="email">
                            ${getError(errors, 'email')}
                            <input name="password" placeholder="password">
                            ${getError(errors, 'password')}
                            <input name="passwordConfirmation" placeholder="password confirmation">
                            ${getError(errors, 'passwordConfirmation')}
                            <button>Sign up</button>
                        </form>
                    </div>
        `,
  });
};
