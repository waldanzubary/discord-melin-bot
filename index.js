require('dotenv').config();
const { Client, IntentsBitField, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

client.on('ready', async () => {
    console.log(`${client.user.tag} is online`);

    const commands = [
        new SlashCommandBuilder().setName('gachawaifu').setDescription('Get a random waifu image'),
        new SlashCommandBuilder().setName('motivate').setDescription('Receive a motivational message'),
        new SlashCommandBuilder().setName('gambling').setDescription('Play a slot machine gacha'),
    ].map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});

client.on('messageCreate', (message) => {
    if (message.author.bot) {
        return;
    }

    if (message.content === 'hello') {
        message.reply('apasih');
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    try {
        if (commandName === 'gachawaifu') {
            await interaction.deferReply({ ephemeral: true });

            const fetch = await import('node-fetch');
            const defaultTags = ['waifu', 'maid', 'marin-kitagawa', 'mori-calliope', 'raiden-shogun', 'oppai', 'selfies', 'uniform', 'kamisato-ayaka'];
            const randomTag = defaultTags[Math.floor(Math.random() * defaultTags.length)];
            const apiUrl = 'https://api.waifu.im/search';
            const params = {
                included_tags: [randomTag],
                height: '>=2000'
            };

            const queryParams = new URLSearchParams();
            for (const key in params) {
                if (Array.isArray(params[key])) {
                    params[key].forEach(value => queryParams.append(key, value));
                } else {
                    queryParams.set(key, params[key]);
                }
            }

            const requestUrl = `${apiUrl}?${queryParams.toString()}`;
            const response = await fetch.default(requestUrl);

            if (!response.ok) {
                throw new Error(`Request failed with status code: ${response.status}`);
            }

            const data = await response.json();

            if (data.images.length === 0) {
                await interaction.followUp('No waifu images found.');
            } else {
                const image = data.images[0];
                const tags = image.tags.map(tag => tag.description).join(', ');

                const embed = new EmbedBuilder()
                    .setTitle('U JUST GOT !')
                    .setDescription(`**Description's  **: ${tags}`)
                    .setImage(image.url)
                    .setColor('#ddcbd0');

                if (image.artist && image.artist.name) {
                    embed.setFooter({ text: `Artist: ${image.artist.name}`, iconURL: image.artist.pixiv });
                } else {
                    embed.setFooter('Artist information not available');
                }

                await interaction.followUp({ embeds: [embed] });
            }
        } else if (commandName === 'motivate') {
            await interaction.deferReply({ ephemeral: true });

            const motivationalMessages = [
                "Gambling is only for someone who want success",
                "Gamblers quit before they win",
                "keys of success is just gambling everything",
                "Most success people is start with gambling",
                "Gambling is way to success",
                "Life is a gamble; the key is knowing when to go all in.",
                "Fortune favors the bold.",
                "Risk it all to gain it all.",
                "In the game of life, sometimes you have to roll the dice.",
                "Taking risks is the price of greatness.",
                "Every big opportunity comes with a big risk.",
                "Don't be afraid to bet on yourself.",
                "Those who risk nothing, gain nothing.",
                "Luck is what happens when preparation meets opportunity.",
                "A ship in harbor is safe, but that's not what ships are built for.",
                "The biggest risk is not taking any risk.",
                "Success often comes to those who dare to act.",
                "Risk-taking is an essential part of progress.",
                "Play your cards right and you'll win big.",
                "Leap and the net will appear.",
                "Dare to dream, dare to try, dare to fail.",
                "The greater the risk, the greater the reward.",
                "Without risk, there can be no breakthroughs.",
                "Life rewards those who dare to live it.",
                "If you never try, you'll never know.",
                "Courage is the foundation of success.",
                "Boldness has genius, power, and magic in it.",
                "Every risk is a potential opportunity.",
                "The only way to predict the future is to create it.",
                "Fortune favors the brave.",
                "Take a chance and you just might surprise yourself.",
                "Opportunity dances with those who are already on the dance floor.",
                "Great things never came from comfort zones.",
                "You miss 100% of the shots you don't take.",
                "The path to success is paved with risks well taken.",
                "Fear regret more than failure.",
                "Life is too short to play it safe.",
                "Embrace uncertainty; some of the most beautiful chapters of our lives won't have a title until much later.",
                "Risk everything, fear nothing.",
                "No risk, no reward.",
                "If you're not willing to risk the unusual, you'll have to settle for the ordinary.",
                "The best way to predict the future is to invent it.",
                "Without risk, there is no victory.",
                "Life's greatest adventures often start with a leap of faith.",
                "Success is walking from failure to failure with no loss of enthusiasm.",
                "The only limits in life are the ones you make.",
                "Live boldly; take risks.",
                "Opportunity often comes disguised in the form of misfortune or temporary defeat.",
                "Risk is the down payment on success.",
                "Your comfort zone is a beautiful place, but nothing ever grows there.",
                "Play to win, not to avoid losing.",
                "Destiny favors the audacious.",
                "Every risk is a step toward greatness.",
                "It's better to fail in originality than to succeed in imitation.",
                "Challenge yourself; it's the only path to growth."
            ];

            const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
            await interaction.followUp(`\`\`\`${randomMessage}\`\`\``);
        } else if (commandName === 'gambling') {
            await interaction.deferReply({ ephemeral: true });

            const slots = ['🍒', '🍋', '🍉', '🍇', '🍓', '⭐'];
            const slotResult = [];

            for (let i = 0; i < 3; i++) {
                const randomSlot = slots[Math.floor(Math.random() * slots.length)];
                slotResult.push(randomSlot);
            }

            const slotMessage = slotResult.join(' | ');
            const isWin = slotResult.every(slot => slot === slotResult[0]);

            if (isWin) {
                await interaction.followUp(`> ## 🎉 Jackpot! 🎉\n > ## ${slotMessage}`);
            } else {
                await interaction.followUp(`> ## 🎰 You got: ${slotMessage}\n > ## Better luck next time!`);
            }
        }
    } catch (error) {
        console.error('An error occurred:', error.message);
        await interaction.followUp('An error occurred while processing your request. Please try again later.');
    }
});

client.login(process.env.TOKEN);
