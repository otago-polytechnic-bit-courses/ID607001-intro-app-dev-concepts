<script>
  import { page } from '$app/state';

  const userRole = page.params.role;
  const slug = page.params.slug;

  const users = [
    {
      id: 1,
      firstName: 'Alice',
      lastName: 'Smith',
      age: 25,
      role: 'admin',
      slug: 'alice-smith',
      biography: 'System administrator with 5+ years of experience.',
      emailAddress: 'alice.smith@company.com',
      permissions: ['user_management', 'system_config', 'reports']
    },
    {
      id: 2,
      firstName: 'Bob',
      lastName: 'Johnson',
      age: 30,
      role: 'moderator',
      slug: 'bob-johnson',
      biography: 'Community moderator ensuring platform safety.',
      emailAddress: 'bob.johnson@company.com',
      permissions: ['content_moderation', 'user_warnings', 'community_management']
    },
    {
      id: 3,
      firstName: 'Charlie',
      lastName: 'Williams',
      age: 28,
      role: 'editor',
      slug: 'charlie-williams',
      biography: 'Content editor specialising in technical documentation.',
      emailAddress: 'charlie.williams@company.com',
      permissions: ['content_edit', 'publish_articles', 'review_submissions']
    },
    {
      id: 4,
      firstName: 'David',
      lastName: 'Jones',
      age: 22,
      role: 'member',
      slug: 'david-jones',
      biography: 'Active community member sharing knowledge.',
      emailAddress: 'david.jones@company.com',
      permissions: ['create_posts', 'comment', 'like_content']
    },
    {
      id: 5,
      firstName: 'Eve',
      lastName: 'Brown',
      age: 27,
      role: 'member',
      slug: 'eve-brown',
      biography: 'Software developer sharing coding tips.',
      emailAddress: 'eve.brown@company.com',
      permissions: ['create_posts', 'comment', 'like_content']
    },
    {
      id: 6,
      firstName: 'Frank',
      lastName: 'Miller',
      age: 35,
      role: 'admin',
      slug: 'frank-miller',
      biography: 'Senior administrator overseeing platform operations.',
      emailAddress: 'frank.miller@company.com',
      permissions: ['user_management', 'system_config', 'reports', 'billing']
    }
  ];

  const user = $derived(users.find((u) => u.role === userRole && u.slug === slug));
</script>

{#if user}
  <h1>User Profile</h1>
  <p>First Name: {user.firstName}</p>
  <p>Last Name: {user.lastName}</p>
  <p>Age: {user.age}</p>
  <p>Role: {user.role}</p>
  <p>Biography: {user.biography}</p>
  <p>Email Address: {user.emailAddress}</p>
  <p>Permissions: {user.permissions.join(', ')}</p>
{:else}
  <p>User not found</p>
{/if}