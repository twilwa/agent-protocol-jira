import ForgeUI, { render, Fragment, Text, IssuePanel, Button, TextField, useProductContext } from "@forge/ui";
import api, { route } from "@forge/api";


const fetchCommentsForIssue = async (issueIdOrKey) => {
  const res = await api
    .asUser()
    .requestJira(route`/rest/api/3/issue/${issueIdOrKey}/comment`);

  const data = await res.json();
  return data.comments;
};

const addCommentForIssue = async (issueIdOrKey, commentBody) => {
  const res = await api
    .asUser()
    .requestJira(route`/rest/api/3/issue/${issueIdOrKey}/comment`, {
      method: 'POST',
      body: JSON.stringify({
        body: commentBody,
      }),
    });

  if (!res.ok) {
    throw new Error(`Failed to add comment to issue ${issueIdOrKey}`);
  }
};

const createIssue = async (issueData) => {
  const res = await api
    .asApp()
    .requestJira(route`/rest/api/3/issue`, {
      method: 'POST',
      body: JSON.stringify(issueData),
    });

  if (!res.ok) {
    throw new Error(`Failed to create issue`);
  }
};

const updateIssue = async (issueIdOrKey, issueData) => {
  const res = await api
    .asApp()
    .requestJira(route`/rest/api/3/issue/${issueIdOrKey}`, {
      method: 'PUT',
      body: JSON.stringify(issueData),
    });

  if (!res.ok) {
    throw new Error(`Failed to update issue ${issueIdOrKey}`);
  }
};

const searchIssues = async (jql) => {
  const res = await api
    .asApp()
    .requestJira(route`/rest/api/3/search?jql=${encodeURIComponent(jql)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

  const data = await res.json();
  return data.issues;
};

const App = () => {
  const { platformContext: { issueKey } } = useProductContext();
  const [commentBody, setCommentBody] = useState('');
  const [commentId, setCommentId] = useState('');

  const handleAddComment = async () => {
    await addCommentForIssue(issueKey, commentBody);
    setCommentBody('');
  };

  const handleDeleteComment = async () => {
    await deleteCommentForIssue(issueKey, commentId);
    setCommentId('');
  };

  return (
    <Fragment>
      <Text>Add or delete comments</Text>
      <TextField label="Comment body" value={commentBody} onChange={setCommentBody} />
      <Button text="Add comment" onClick={handleAddComment} />
      <TextField label="Comment ID to delete" value={commentId} onChange={setCommentId} />
      <Button text="Delete comment" onClick={handleDeleteComment} />
    </Fragment>
  );
};

export const run = render(
  <IssuePanel>
    <App />
  </IssuePanel>
);
