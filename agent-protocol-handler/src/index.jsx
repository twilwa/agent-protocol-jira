import ForgeUI, { render, Fragment, Text, IssuePanel } from '@forge/ui';
import api, { route } from "@forge/api";
import ForgeUI, { render, Fragment, Text, IssuePanel, useProductContext } from "@forge/ui";


const fetchCommentsForIssue = async (issueIdOrKey) => {
  const res = await api
    .asUser()
    .requestJira(route`/rest/api/3/issue/${issueIdOrKey}/comment`);

  const data = await res.json();
  return data.comments;
};

const deleteCommentForIssue = async (issueIdOrKey, commentId) => {
  const res = await api
    .asUser()
    .requestJira(route`/rest/api/3/issue/${issueIdOrKey}/comment/${commentId}`, {
      method: 'DELETE',
    });

  if (!res.ok) {
    throw new Error(`Failed to delete comment with id ${commentId} for issue ${issueIdOrKey}`);
  }
};

const App = () => {
  return (
    <Fragment>
      <Text>Hello world!</Text>
    </Fragment>
  );
};

export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);
