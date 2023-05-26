async function auditJournalSettings(guild) {
    const auditLogs = await guild.fetchAuditLogs({
        limit: 10,
    });

    auditLogs.entries.mapValues(log => {
        
    })
}